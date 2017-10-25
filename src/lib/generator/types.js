import type { IPluginValidator } from '../plugin/interfaces'
import type { Component } from '../component/types'
import type { Config } from '../config/types'
import type { IEventEmitter, IEventListener } from '../EventEmitter/interfaces'

export type RunDependencies = {
  generateComponentFn: (component: Component, config: Config) => Promise<any>,
  emitter: IEventEmitter & IEventListener,
  pluginValidator: IPluginValidator,
}
