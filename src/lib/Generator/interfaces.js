// @flow

import type { IEventListener } from '../EventEmitter/interfaces'
import type { ComponentOptions } from '../Component/types'

export interface IGenerator {
  generate(name: string, options: ComponentOptions): IEventListener;
}
