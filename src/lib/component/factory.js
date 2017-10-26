// @flow

import type { ComponentProps } from './types'
import type { ComponentFile } from '../component-file/types'

export default function createReactComponent(
  props: ComponentProps,
  files: ComponentFile[]
): Object {
  const { name, path } = props
  const filesMap: Map<string, ComponentFile> = new Map()

  // Add file if requested on props
  files.forEach(file => {
    if (props[file.role()]) {
      filesMap.set(file.role(), file)
    }
  })

  // Public API
  return {
    name() {
      return name
    },
    path() {
      return path
    },
    files() {
      return filesMap
    },
  }
}
