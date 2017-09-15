// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import nunjucks from "nunjucks"

import type { IReactComponent, IRenderable } from "./interfaces"
import type { IFile } from "../ComponentFile/interfaces"
import type { ITemplate } from "../Template/interfaces"

function getTemplateString(template: ITemplate | null): Promise<string> {
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

export default (writeFile: (file: IFile, data: string) => Promise<string>) => (
  component: IReactComponent
): Promise<any> => {
  const componentFiles: Map<string, IFile> = component.getFiles()
  const roles: Array<string> = Array.from(componentFiles.keys())

  const filePromises: Array<Promise<any>> = roles.map((role: string) => {
    const temp = componentFiles.get(role)

    if (typeof temp === "undefined") {
      throw new Error()
    }

    const file: IFile = {
      ...temp
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
