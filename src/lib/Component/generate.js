// @flow

import type { Component } from './types'
import type { Config } from '../Config/types'
import type { IComponentFs } from './interfaces'
import type { ComponentFile } from '../ComponentFile/types'
import type { RenderTemplateFn } from '../Template/types'

export default (
  componentFs: IComponentFs,
  renderTemplateFn: RenderTemplateFn
) =>
  function generateComponent(component: Component, config: Config) {
    // TODO: Rethink removing strategy when component-name-root-dir rule is set to false
    return componentFs
      .removeComponentRootDir(component, config)
      .then(componentFs.createComponentRootDir)
      .then(component => {
        const componentFiles: Map<string, ComponentFile> = component.getFiles()
        const roles: string[] = Array.from(componentFiles.keys())

        const filePromises: Array<Promise<any>> = roles.map(role => {
          const file: any = componentFiles.get(role)

          return componentFs
            .writeComponentFile(file, file.getRenderedOutput(renderTemplateFn))
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
