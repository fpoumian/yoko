// @flow
import EventEmitter from "events"

import type { IFile } from "../ComponentFile/interfaces"

export interface IReactComponent {
  getFiles(): Map<string, IFile>,
  getEmitter(): EventEmitter
}

export interface IRenderable {
  render(context: Object): string
}
