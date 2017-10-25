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
  const componentFile = {
    path() {
      return path.resolve(dir, `${name}.${extension}`)
    },
    getName() {
      return name
    },
    getExtension() {
      return extension
    },
    getTemplate() {
      return template
    },
    hasTemplate() {
      return this.getTemplate() !== null
    },
    renderOutput(renderTemplateFn: RenderTemplateFn) {
      return !this.hasTemplate() ? '' : renderTemplateFn(template)
    },
    getRole() {
      return role
    },
  }

  return componentFile
}
