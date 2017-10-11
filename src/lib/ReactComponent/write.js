// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import type { IRenderable } from "./interfaces"
import type { ReactComponent } from "./types"
import type { ComponentFile } from "../ComponentFile/types"
import type { Template } from "../Template/types"
import type { IFileSystem } from "../FileSystem/interfaces"
import makeWriteFile from "../ComponentFile/write"
import type { ITemplateCompiler } from "../Template/interfaces"

function getTemplateString(template: Template | null): Promise<string> {
  if (!template) {
    return Promise.resolve("")
  }
  const templateString = require(template.getPath())
  return Promise.resolve(templateString)
}

function compileTemplateString(
  templateCompiler: ITemplateCompiler,
  templateString: string
): IRenderable {
  return templateCompiler.compile(templateString)
}

function renderCompiledTemplate(
  compiledTemplate: IRenderable,
  context: Object
): string {
  return compiledTemplate.render(context)
}

export default (fs: IFileSystem, templateCompiler: ITemplateCompiler) =>
  function writeComponentFiles(component: ReactComponent): Promise<any> {
    const componentFiles: Map<string, ComponentFile> = component.getFiles()
    const roles: Array<string> = Array.from(componentFiles.keys())

    const filePromises: Array<Promise<any>> = roles.map((role: string) => {
      const file = componentFiles.get(role)

      if (typeof file === "undefined") {
        throw new Error()
      }

      return getTemplateString(file.getTemplate())
        .then(templateString =>
          compileTemplateString(templateCompiler, templateString)
        )
        .then(compiledTemplate =>
          renderCompiledTemplate(compiledTemplate, {
            componentName: component.getName()
          })
        )
        .then(renderedTemplate => {
          const writeFile = makeWriteFile(fs)
          return writeFile(file, renderedTemplate).then(path => {
            const fileRole = file.getRole()
            return {
              [fileRole]: path
            }
          })
        })
        .catch(e => {
          const err: Error = new Error()
          err.message = `Error writing file to ${file.getPath()}`
          err.stack = e.stack
          throw err
        })
    })

    return Promise.all(filePromises)
  }
