// @flow
import EventEmitter from "events"

import type { IFile } from "../File/interfaces"

export interface IReactComponent {
  getFiles(): Map<string, IFile>,
  getPath(): string,
  getName(): string,
  getEmitter(): EventEmitter
}
