// @flow

import type { ComponentFile, FileProps } from '../ComponentFile/types'
import type { Config } from '../Config/types'
import type { Component } from './types'
import type { IReadable } from '../Readable/interfaces'

export interface IComponentFs {
  removeComponentRootDir(
    component: Component,
    config: Config
  ): Promise<Component>;
  createComponentRootDir(component: Component): Promise<Component>;
  writeComponentFile(file: IReadable, data: string): Promise<any>;
  resolveComponentFileTemplate(
    config: Object,
    fileProps: FileProps
  ): Object | null;
}

export interface IComposable {
  getFiles(): Map<string, ComponentFile>;
}

export interface IRenderable {
  render(context: Object): string;
}
