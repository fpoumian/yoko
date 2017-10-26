// @flow

import type { IHasPrefixedName, IInitialable } from './interfaces'
import type { IHasName } from '../common/interfaces'
import type { FileProps } from '../component-file/types'

export type Plugin = IInitialable & IHasPrefixedName & IHasName

export type LoadPluginsFn = (plugins: string[]) => Plugin[]
export type ValidatePluginFn = (
  plugin: Plugin,
  fileProps: FileProps
) => FileProps
