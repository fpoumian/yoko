// @flow

import type { IEventListener } from '../EventEmitter/interfaces'
import type { ComponentOptions } from '../Component/types'

export interface IGenerator {
  generate(name: string, options: ComponentOptions): IEventListener;
}

export interface ICache {
  get(key: string): any;
  set(key: string, value: any, options?: Object): any;
}
