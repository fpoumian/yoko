// @flow
import path from 'path'

import type { ComponentFile, FileProps } from './types'
import createReadable from '../Readable/factory'
import createTemplate from '../Template/factory'

export default function(props: FileProps): ComponentFile {
  const { name, extension, role } = props
  const template = props.template ? createTemplate(props.template) : null

  // Public API
  const componentFile: ComponentFile = {
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
    getRole() {
      return role
    },
  }

  return componentFile
}
