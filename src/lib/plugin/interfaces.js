// @flow

import type { Plugin } from './types'
import type { FileProps } from '../component-file/types'

export interface IPluginValidator {
  validate(plugin: Plugin, fileProps: FileProps): FileProps;
}

export interface IInitialable {
  init(Object, Object): Object;
}
