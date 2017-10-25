// @flow

import type { Component, ComponentProps } from './types'
import type { ComponentFile } from '../component-file/types'

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
    getName() {
      return name
    },
    path() {
      return path
    },
    getFiles() {
      return filesMap
    },
  }

  return reactComponent
}
