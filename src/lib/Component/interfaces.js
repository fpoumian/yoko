// @flow

import type { ComponentFile } from '../ComponentFile/types'

export interface IComposable {
  getFiles(): Map<string, ComponentFile>;
}

export interface IRenderable {
  render(context: Object): string;
}
