// @flow

import type { IFileSystem } from '../FileSystem/interfaces'
import type { Component } from './types'
import type { Config } from '../Config/types'
import makeWriteComponentFile from '../ComponentFile/write'
import makeResolveComponentFileTemplate from '../ComponentFile/resolveTemplate'

export default function(fs: IFileSystem) {
  function removeComponentRootDir(
    component: Component,
    config: Config
  ): Promise<Component> {
    return !config.rules['component-name-root-dir']
      ? Promise.resolve(component)
      : fs.remove(component.getPath()).then(() => component)
  }

  function createComponentRootDir(component: Component): Promise<Component> {
    return fs.ensureDir(component.getPath()).then(() => component)
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
