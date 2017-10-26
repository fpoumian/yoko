import isPlainObject from 'lodash/isPlainObject'

import type { ITemplateCompiler } from './interfaces'
import type { IFileFormatter } from '../component-file/interfaces'
import type { ICanRender } from '../component/interfaces'
import type { Template } from './types'

export default (
  templateCompiler: ITemplateCompiler,
  fileFormatter: IFileFormatter,
  prettierConfig: Object | boolean,
  require: string => any
) =>
  function renderTemplate(template: Template) {
    const compiledTemplate: ICanRender = templateCompiler.compile(
      require(template.path())
    )
    const renderedFile: string = compiledTemplate.render(template.context())

    return isPlainObject(prettierConfig)
      ? fileFormatter.format(renderedFile, prettierConfig)
      : fileFormatter.format(renderedFile)
  }
