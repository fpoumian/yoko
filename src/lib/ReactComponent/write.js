// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import nunjucks from "nunjucks"

import type { IReactComponent } from "./interfaces"
import type { IFile } from "../File/interfaces"
import type { IRenderable } from "../Interfaces/IRenderable"

function getTemplateString(templatePath: string | null): Promise<string> {
  if (!templatePath) {
    return Promise.resolve("")
  }
  const template = require(templatePath).default
  return Promise.resolve(template)
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

export default (writeFile: Function) => (
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

    return getTemplateString(file.getTemplatePath())
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
