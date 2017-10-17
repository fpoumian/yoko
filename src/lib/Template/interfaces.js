// @flow

import type { IRenderable } from "../Component/interfaces"

export interface ITemplateCompiler {
  compile: string => IRenderable
}
