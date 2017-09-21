// @flow
import EventEmitter from "events"

import type { ComponentFile } from "../ComponentFile/types"

export interface IReactComponent {
  getFiles(): Map<string, ComponentFile>,
  getEmitter(): EventEmitter
}

export interface IRenderable {
  render(context: Object): string
}
