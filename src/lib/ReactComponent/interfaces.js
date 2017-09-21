// @flow
import EventEmitter from "events"

import type { ComponentFile } from "../ComponentFile/types"

export interface IReactComponent {
  getFiles(): Map<string, ComponentFile>,
  addFile(file: ComponentFile): void,
  getEmitter(): EventEmitter
}

export interface IRenderable {
  render(context: Object): string
}
