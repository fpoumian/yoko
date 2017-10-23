// @flow

import EventEmitter from 'events'

import makeWriteComponentFiles from './write'
import reduceComponentPaths from './reducePaths'
import type { Component } from './types'
import type { ITemplateCompiler } from '../Template/interfaces'
import type { IFileFormatter } from '../ComponentFile/interfaces'
import type { Config } from '../Config/types'
import type { IComponentFs } from './interfaces'

export default (
  componentFs: IComponentFs,
  emitter: EventEmitter,
  templateCompiler: ITemplateCompiler,
  fileFormatter: IFileFormatter
) =>
  function generateComponent(component: Component, config: Config) {
    const writeComponentFiles = makeWriteComponentFiles(
      componentFs,
      templateCompiler,
      fileFormatter
    )

    // TODO: Rethink removing strategy when component-name-root-dir rule is set to false
    return componentFs
      .removeComponentRootDir(component, config)
      .then(componentFs.createComponentRootDir)
      .then(component => writeComponentFiles(component, config))
      .then((componentFilesPaths: Object[]) => {
        componentFilesPaths.forEach(filePath => {
          Object.keys(filePath).forEach(role => {
            emitter.emit('fileWritten', filePath[role])
            emitter.emit(`${role}FileWritten`, filePath[role])
          })
        })
        return componentFilesPaths
      })
      .then((componentFilesPaths: Object[]) =>
        reduceComponentPaths(component, componentFilesPaths)
      )
      .catch(err => {
        throw err
      })
  }
