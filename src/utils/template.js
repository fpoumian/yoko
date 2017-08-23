// @flow

import nunjucks from "nunjucks"

interface IRenderable {
  render(context: Object): string
}

export function compileStringTemplate(stringTemplate: string): IRenderable {
  return nunjucks.compile(stringTemplate)
}

export function renderCompiledTemplate(
  compiledTemplate: IRenderable,
  context: Object
): string {
  return compiledTemplate.render(context)
}
