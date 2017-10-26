// @flow

import type { ComponentFile, FileProps } from '../component-file/types'
import type { Config } from '../config/types'
import type { Component } from './types'
import type { IHasPath } from '../common/interfaces'

export interface IComponentFs {
  removeComponentRootDir(
    component: Component,
    config: Config
  ): Promise<Component>;
  createComponentRootDir(component: Component): Promise<Component>;
  writeComponentFile(file: IHasPath, data: string): Promise<any>;
  resolveComponentFileTemplate(
    config: Object,
    fileProps: FileProps
  ): Object | null;
}

export interface IHasFiles {
  files(): Map<string, ComponentFile>;
}

export interface ICanRender {
  render(context: Object): string;
}
