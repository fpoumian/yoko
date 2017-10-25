// @flow

import type { Template } from '../template/types'

export interface IFileFormatter {
  format(string, ?Object | boolean): string;
}

export interface IFile {
  getExtension(): string;
}

export interface IHasTemplate {
  getTemplate(): Template | null;
}

export interface IHasExtension {
  getExtension(): string;
}

export interface IHasRole {
  getRole(): string;
}

export interface ICanRenderOutput {
  renderOutput(renderTemplateFn: (template: Template) => string): string;
}
