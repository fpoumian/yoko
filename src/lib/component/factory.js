// @flow

import type { Component, ComponentProps } from './types'
import createReadable from '../Readable/factory'
import type { ComponentFile } from '../ComponentFile/types'

export default function createReactComponent(
  props: ComponentProps,
  files: ComponentFile[]
): Component {
  const { name, path } = props
  const filesMap: Map<string, ComponentFile> = new Map()

  // Add file if requested on props
  files.forEach(file => {
    if (props[file.getRole()]) {
      filesMap.set(file.getRole(), file)
    }
  })

  // Public API
  const reactComponent: Component = {
    ...createReadable({
      name,
      path,
    }),
    getFiles() {
      return filesMap
    },
  }

  return reactComponent
}
