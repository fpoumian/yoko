import type { IPluginValidator } from '../Plugin/interfaces'
import type { Component } from '../Component/types'
import type { Config } from '../Config/types'
import type { IEventEmitter, IEventListener } from '../EventEmitter/interfaces'

export type RunDependencies = {
  generateComponentFn: (component: Component, config: Config) => Promise<any>,
  emitter: IEventEmitter & IEventListener,
  pluginValidator: IPluginValidator,
}
