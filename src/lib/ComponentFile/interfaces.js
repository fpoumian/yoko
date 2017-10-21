// @flow

import type { Template } from '../Template/types'

export interface IComponentFile {
  getTemplate(): Template | null;
  hasTemplate(): boolean;
  getRole(): string;
}

export interface IFile {
  getExtension(): string;
}

export interface IFileFormatter {
  format(string, ?Object): string;
}
