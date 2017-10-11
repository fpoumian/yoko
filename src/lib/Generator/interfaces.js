// @flow

import type { IEventListener } from "../EventEmitter/interfaces"
import type { ReactComponentOptions } from "../ReactComponent/types"

export interface IGenerator {
  generate(name: string, options: ReactComponentOptions): IEventListener
}
