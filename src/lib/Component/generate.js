// @flow
import isPlainObject from 'lodash/isPlainObject'

import type { Component } from './types'
import type { ITemplateCompiler } from '../Template/interfaces'
import type { IFileFormatter } from '../ComponentFile/interfaces'
import type { Config } from '../Config/types'
import type { IComponentFs, IRenderable } from './interfaces'
import type { ComponentFile } from '../ComponentFile/types'

export default (
  componentFs: IComponentFs,
  templateCompiler: ITemplateCompiler,
  fileFormatter: IFileFormatter
) =>
  function generateComponent(component: Component, config: Config) {
    // TODO: Rethink removing strategy when component-name-root-dir rule is set to false
    return componentFs
      .removeComponentRootDir(component, config)
      .then(componentFs.createComponentRootDir)
      .then(component => {
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

          // If the file has a template specified then compile it and render it.
          if (template) {
            const compiledTemplate: IRenderable = templateCompiler.compile(
              require(template.getPath())
            )
            const renderedFile: string = compiledTemplate.render(
              template.getContext()
            )

            // if there is a prettier configuration specified use it to format the rendered file;
            // otherwise just use the default prettier configuration.
            fileOutput = isPlainObject(config.formatting.prettier)
              ? // $FlowFixMe
                fileFormatter.format(renderedFile, config.formatting.prettier)
              : fileFormatter.format(renderedFile)
          } else {
            // If there is not template specified for this file, then just output en empty string.
            fileOutput = ''
          }

          return componentFs
            .writeComponentFile(file, fileOutput)
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
      })
  }
