// @flow
import type { ITemplate } from "../Template/interfaces"

export interface IFile {
  getName(): string,
  getExtension(): string,
  getPath(): string,
  getTemplate(): ITemplate | null,
  getRole(): string
}
