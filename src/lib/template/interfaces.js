// @flow

import type { IRenderable } from '../component/interfaces'

export interface ITemplateCompiler {
  compile: string => IRenderable;
}
