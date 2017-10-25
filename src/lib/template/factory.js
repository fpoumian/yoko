// @flow
import path from 'path'
import type { TemplateProps } from './types'

export default function({ name, dir, context }: TemplateProps): Object {
  return {
    getPath() {
      return path.resolve(dir, name)
    },
    getContext() {
      return context
    },
  }
}
