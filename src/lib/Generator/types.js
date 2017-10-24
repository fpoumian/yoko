import type { IComponentFs } from '../Component/interfaces'
import type { ITemplateCompiler } from '../Template/interfaces'
import type { IFileFormatter } from '../ComponentFile/interfaces'
import type { IPluginValidator } from '../Plugin/interfaces'
import type { Component } from '../Component/types'
import type { Config } from '../Config/types'

export type GeneratorDependencies = {
  generateComponentFn: (component: Component, config: Config) => Promise<any>,
  pluginValidator: IPluginValidator,
}
