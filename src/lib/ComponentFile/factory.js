// @flow
import path from 'path'

import type { FileProps } from './types'
import createReadable from '../Readable/factory'
import createTemplate from '../template/factory'
import type { RenderTemplateFn, Template } from '../template/types'

export default function(props: FileProps) {
  const { name, extension, role } = props
  const template: Template | null = props.template
    ? createTemplate(props.template)
    : null

  // Public API
  const componentFile = {
    ...createReadable({
      path: path.resolve(props.dir, `${props.name}.${props.extension}`),
      name,
    }),
    getExtension() {
      return extension
    },
    getTemplate() {
      return template
    },
    getRenderedOutput(renderTemplateFn: RenderTemplateFn) {
      return !template ? '' : renderTemplateFn(template)
    },
    getRole() {
      return role
    },
  }

  return componentFile
}
