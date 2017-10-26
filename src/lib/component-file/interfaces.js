// @flow

import type { Template } from '../template/types'

export interface IFileFormatter {
  format(string, ?Object | boolean): string;
}

export interface IFile {
  extension(): string;
}

export interface IHasTemplate {
  template(): Template | null;
}

export interface IHasExtension {
  extension(): string;
}

export interface IHasRole {
  role(): string;
}

export interface ICanRenderOutput {
  renderOutput(renderTemplateFn: (template: Template) => string): string;
}
