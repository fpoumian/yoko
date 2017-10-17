// @flow

interface ITemplate {
  getPath(): string;
}

export type Template = ITemplate

export type TemplateProps = {
  name: string,
  path: string,
  dir: string,
}
