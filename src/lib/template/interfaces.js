// @flow

import type { ICanRender } from '../component/interfaces'

export interface ITemplateCompiler {
  compile: string => ICanRender;
}

export interface IHasContext {
  getContext(): Object;
}
