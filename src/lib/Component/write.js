// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import isPlainObject from 'lodash/isPlainObject'

import type { IRenderable } from './interfaces'
import type { Component } from './types'
import type { ComponentFile } from '../ComponentFile/types'
import type { Template } from '../Template/types'
import type { IFileSystem } from '../FileSystem/interfaces'
import makeWriteFile from '../ComponentFile/write'
import type { ITemplateCompiler } from '../Template/interfaces'
import type { IFileFormatter } from '../ComponentFile/interfaces'
import type { Config } from '../Config/types'

function getTemplateString(template: Template): string {
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
    component: Component,
    config: Config
  ): Promise<any> {
    const componentFiles: Map<string, ComponentFile> = component.getFiles()
    const roles: string[] = Array.from(componentFiles.keys())

    const filePromises: Array<Promise<any>> = roles.map((role: string) => {
      const file = componentFiles.get(role)

      if (typeof file === 'undefined') {
        return Promise.reject(
          new Error(`Error writing file to ${component.getPath()}`)
        )
      }

      let fileOutput
      const template = file.getTemplate()

      if (template) {
        const compiledTemplate = compileTemplateString(
          templateCompiler,
          getTemplateString(template)
        )

        const renderedFile = renderCompiledTemplate(
          compiledTemplate,
          template.getContext()
        )

        fileOutput = isPlainObject(config.formatting.prettier)
          ? // $FlowFixMe
            fileFormatter.format(renderedFile, config.formatting.prettier)
          : fileFormatter.format(renderedFile)
      } else {
        fileOutput = ''
      }

      const writeFile = makeWriteFile(fs)

      return writeFile(file, fileOutput)
        .then(path => {
          const fileRole = file.getRole()
          return {
            [fileRole]: path,
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
