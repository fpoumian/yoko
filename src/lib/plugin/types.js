// @flow

import type { IHasPrefixedName, IInitialable } from './interfaces'
import type { IHasName } from '../common/interfaces'

export type Plugin = IInitialable & IHasPrefixedName & IHasName

export type LoadPluginsFn = (plugins: string[]) => Plugin[]
