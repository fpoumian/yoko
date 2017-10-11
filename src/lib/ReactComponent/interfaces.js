// @flow

import type { ComponentFile } from "../ComponentFile/types"

export interface IReactComponent {
  getFiles(): Map<string, ComponentFile>
}

export interface IRenderable {
  render(context: Object): string
}
