// @flow

import type { IRenderable } from "../ReactComponent/interfaces"

export interface ITemplateCompiler {
  compile: string => IRenderable
}
