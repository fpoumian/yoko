// @flow

import type { Template } from "../Template/types"

export interface IComponentFile {
  getTemplate(): Template | null,
  getRole(): string
}

export interface IFile {
  getExtension(): string
}
