// @flow

import type { IInitialable } from './interfaces'
import type { IHasName } from '../common/interfaces'

interface hasPrefixedName {
  getPrefixedName(): string;
}

export type Plugin = IInitialable & hasPrefixedName & IHasName

export type LoadPluginsFn = (plugins: string[]) => Plugin[]
