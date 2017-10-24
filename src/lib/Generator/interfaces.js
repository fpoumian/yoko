// @flow

import type { IEventListener } from '../EventEmitter/interfaces'
import type { ReactComponentOptions } from '../Component/types'

export interface IGenerator {
  generate(name: string, options: ReactComponentOptions): IEventListener;
}
