// @flow

import type { IEventListener } from '../common/interfaces'
import type { ComponentOptions } from '../component/types'

export interface IGenerator {
  generate(name: string, options: ComponentOptions): IEventListener;
}

export interface ICache {
  get(key: string): any;
  set(key: string, value: any, options?: Object): any;
}
