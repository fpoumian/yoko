// @flow

import EventEmitter from 'events'

import makeWriteComponentFiles from './write'
import { reduceComponentPaths } from './utils'
import type { Component } from './types'
import type { IFileSystem } from '../FileSystem/interfaces'
import type { ITemplateCompiler } from '../Template/interfaces'
import type { IFileFormatter } from '../ComponentFile/interfaces'
import type { Config } from '../Config/types'

const makeRemoveComponentRootDir = (fs: IFileSystem) =>
  function removeComponentRootDir(component: Component): Promise<Component> {
    return fs.remove(component.getPath()).then(() => component)
  }

const makeCreateComponetRootDir = (fs: IFileSystem) =>
  function createComponentRootDir(component: Component): Promise<Component> {
    return fs.ensureDir(component.getPath()).then(() => component)
  }

export default (
  fs: IFileSystem,
  emitter: EventEmitter,
  templateCompiler: ITemplateCompiler,
  fileFormatter: IFileFormatter
) =>
  function generateComponent(component: Component, config: Config) {
    const writeComponentFiles = makeWriteComponentFiles(
      fs,
      templateCompiler,
      fileFormatter
    )
    const removeComponentRootDir = makeRemoveComponentRootDir(fs)
    const createComponentRootDir = makeCreateComponetRootDir(fs)

    return removeComponentRootDir(component)
      .then(createComponentRootDir)
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
