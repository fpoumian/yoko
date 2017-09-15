// @flow

import type { Template } from "../Template/types"

export interface IFile {
  getName(): string,
  getExtension(): string,
  getPath(): string,
  getTemplate(): Template | null,
  getRole(): string
}
