// @flow

import type { Template } from '../Template/types'

export interface IFileFormatter {
  format(string, ?Object | boolean): string;
}

export interface IComponentFile {
  getTemplate(): Template | null;
  getRenderedOutput(renderTemplateFn: (template: Template) => string): string;
  getRole(): string;
}

export interface IFile {
  getExtension(): string;
}
