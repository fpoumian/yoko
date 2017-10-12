// @flow

import type { IReadable } from "../Readable/interfaces"
import type { IInitialable } from "./interfaces"

export type Plugin = IReadable & IInitialable

export type LoadPluginsFn = (plugins: Array<string>) => Array<Plugin>
