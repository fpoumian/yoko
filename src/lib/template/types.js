// @flow

import type { IHasContext } from './interfaces'
import type { IHasPath } from '../common/interfaces'

export type Template = (IHasContext & IHasPath) | null

export type TemplateProps = {
  name: string,
  path: string,
  dir: string,
  context: Object,
}

export type RenderTemplateFn = (template: Template) => string
