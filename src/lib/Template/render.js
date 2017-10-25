import isPlainObject from 'lodash/isPlainObject'

import type { ITemplateCompiler } from './interfaces'
import type { IFileFormatter } from '../ComponentFile/interfaces'
import type { IRenderable } from '../Component/interfaces'
import type { Template } from './types'

export default (
  templateCompiler: ITemplateCompiler,
  fileFormatter: IFileFormatter,
  prettierConfig: Object | boolean,
  require: string => any
) =>
  function renderTemplate(template: Template) {
    const compiledTemplate: IRenderable = templateCompiler.compile(
      require(template.getPath())
    )
    const renderedFile: string = compiledTemplate.render(template.getContext())

    return isPlainObject(prettierConfig)
      ? fileFormatter.format(renderedFile, prettierConfig)
      : fileFormatter.format(renderedFile)
  }
