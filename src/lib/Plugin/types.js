// @flow

import type { IReadable } from '../Readable/interfaces'
import type { IInitialable } from './interfaces'

interface hasPrefixedName {
  getPrefixedName(): string;
}

export type Plugin = IReadable & IInitialable & hasPrefixedName

export type LoadPluginsFn = (plugins: string[]) => Plugin[]
