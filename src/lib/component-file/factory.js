// @flow
import path from 'path'

import type { FileProps } from './types'
import createTemplate from '../template/factory'
import type { RenderTemplateFn, Template } from '../template/types'

export default function(props: FileProps) {
  const { name, extension, role, dir } = props
  const template: Template = props.template
    ? createTemplate(props.template)
    : null

  // Public API
  return {
    path() {
      return path.resolve(dir, `${name}.${extension}`)
    },
    name() {
      return name
    },
    extension() {
      return extension
    },
    template() {
      return template
    },
    hasTemplate() {
      return this.template() !== null
    },
    renderOutput(renderTemplateFn: RenderTemplateFn) {
      return !this.hasTemplate() ? '' : renderTemplateFn(template)
    },
    role() {
      return role
    },
  }
}
