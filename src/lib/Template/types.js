// @flow

interface ITemplate {
  getPath(): string;
  getContext(): Object;
}

export type Template = ITemplate

export type TemplateProps = {
  name: string,
  path: string,
  dir: string,
  context: Object,
}

export type RenderTemplateFn = (template: Template) => string
