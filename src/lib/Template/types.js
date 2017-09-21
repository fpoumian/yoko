// @flow

interface ITemplate {
  getDir(): string,
  getPath(): string
}

export type Template = ITemplate

export type TemplateProps = {
  name: string,
  path: string,
  dir: string
}
