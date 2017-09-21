// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import nunjucks from "nunjucks"

import type { IRenderable } from "./interfaces"
import type { ReactComponent } from "./types"
import type { IReadable } from "../Readable/interfaces"
import type { ComponentFile, writeFile } from "../ComponentFile/types"

function getTemplateString(template: IReadable | null): Promise<string> {
  if (!template) {
    return Promise.resolve("")
  }
  const templateString = require(template.getPath()).default
  return Promise.resolve(templateString)
}

function compileTemplateString(templateString: string): IRenderable {
  return nunjucks.compile(templateString)
}

function renderCompiledTemplate(
  compiledTemplate: IRenderable,
  context: Object
): string {
  return compiledTemplate.render(context)
}

export default (writeFile: writeFile) => (
  component: ReactComponent
): Promise<any> => {
  const componentFiles: Map<string, ComponentFile> = component.getFiles()
  const roles: Array<string> = Array.from(componentFiles.keys())

  const filePromises: Array<Promise<any>> = roles.map((role: string) => {
    const file = componentFiles.get(role)

    if (typeof file === "undefined") {
      throw new Error()
    }

    return getTemplateString(file.getTemplate())
      .then(compileTemplateString)
      .then(compiledTemplate =>
        renderCompiledTemplate(compiledTemplate, {
          componentName: component.getName()
        })
      )
      .then(renderedTemplate =>
        writeFile(file, renderedTemplate).then(path => {
          const fileRole = file.getRole()
          component.getEmitter().emit("fileWritten", path)
          component.getEmitter().emit(`${fileRole}FileWritten`, path)
          return {
            [fileRole]: path
          }
        })
      )
      .catch(e => {
        const err: Error = new Error()
        err.message = `Error writing file to ${file.getPath()}`
        err.stack = e.stack
        throw err
      })
  })

  return Promise.all(filePromises)
}
