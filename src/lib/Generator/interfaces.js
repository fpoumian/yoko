// @flow

import type { IEventListener } from '../EventEmitter/interfaces'
import type { ReactComponentOptions } from '../Component/types'
import type { IComponentFs } from '../Component/interfaces'
import type { ITemplateCompiler } from '../Template/interfaces'
import type { IFileFormatter } from '../ComponentFile/interfaces'
import type { IPluginValidator } from '../Plugin/interfaces'

export interface IGenerator {
  generate(name: string, options: ReactComponentOptions): IEventListener;
}

export interface IGeneratorDependencies {
  componentFs: IComponentFs;
  templateCompiler: ITemplateCompiler;
  fileFormatter: IFileFormatter;
  pluginValidator: IPluginValidator;
}
