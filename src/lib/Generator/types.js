import type { IComponentFs } from '../Component/interfaces'
import type { ITemplateCompiler } from '../Template/interfaces'
import type { IFileFormatter } from '../ComponentFile/interfaces'
import type { IPluginValidator } from '../Plugin/interfaces'

export type GeneratorDependencies = {
  componentFs: IComponentFs,
  templateCompiler: ITemplateCompiler,
  fileFormatter: IFileFormatter,
  pluginValidator: IPluginValidator,
}
