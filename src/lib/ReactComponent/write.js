// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import isPlainObject from "lodash/isPlainObject"

import type { IRenderable } from "./interfaces"
import type { ReactComponent } from "./types"
import type { ComponentFile } from "../ComponentFile/types"
import type { Template } from "../Template/types"
import type { IFileSystem } from "../FileSystem/interfaces"
import makeWriteFile from "../ComponentFile/write"
import type { ITemplateCompiler } from "../Template/interfaces"
import type { IFileFormatter } from "../ComponentFile/interfaces"
import type { Config } from "../Config/types"

function getTemplateString(template: Template | null): string {
  if (!template) {
    return ""
  }
  return require(template.getPath())
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

export default (
  fs: IFileSystem,
  templateCompiler: ITemplateCompiler,
  fileFormatter: IFileFormatter
) =>
  function writeComponentFiles(
    component: ReactComponent,
    config: Config
  ): Promise<any> {
    const componentFiles: Map<string, ComponentFile> = component.getFiles()
    const roles: Array<string> = Array.from(componentFiles.keys())

    const filePromises: Array<Promise<any>> = roles.map((role: string) => {
      const file = componentFiles.get(role)

      if (typeof file === "undefined") {
        throw new Error()
      }

      const compiledTemplate = compileTemplateString(
        templateCompiler,
        getTemplateString(file.getTemplate())
      )

      const renderedFile = renderCompiledTemplate(compiledTemplate, {
        componentName: component.getName()
      })

      const formattedFile = isPlainObject(config.formatting.prettier)
        ? // $FlowFixMe
          fileFormatter.format(renderedFile, config.formatting.prettier)
        : fileFormatter.format(renderedFile)

      const writeFile = makeWriteFile(fs)

      return writeFile(file, formattedFile)
        .then(path => {
          const fileRole = file.getRole()
          return {
            [fileRole]: path
          }
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
