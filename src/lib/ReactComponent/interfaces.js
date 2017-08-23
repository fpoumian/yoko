// @flow

import type { IFile } from "../File/interfaces"

export interface IReactComponent {
  getFiles(): { [string]: IFile },
  getPath(): string,
  getName(): string
}
