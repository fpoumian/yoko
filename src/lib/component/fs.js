// @flow

import type { IFileSystem } from '../common/interfaces'
import type { Component } from './types'
import type { Config } from '../config/types'
import makeWriteComponentFile from '../component-file/write'
import makeResolveComponentFileTemplate from '../component-file/resolveTemplate'

export default function(fs: IFileSystem) {
  function removeComponentRootDir(
    component: Component,
    config: Config
  ): Promise<Component> {
    return !config.rules['component-name-root-dir']
      ? Promise.resolve(component)
      : fs.remove(component.path()).then(() => component)
  }

  function createComponentRootDir(component: Component): Promise<Component> {
    return fs.ensureDir(component.path()).then(() => component)
  }

  const writeComponentFile = makeWriteComponentFile(fs)
  const resolveComponentFileTemplate = makeResolveComponentFileTemplate(fs)

  return {
    removeComponentRootDir,
    createComponentRootDir,
    writeComponentFile,
    resolveComponentFileTemplate,
  }
}
