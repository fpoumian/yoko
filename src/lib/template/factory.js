// @flow
import path from 'path'
import type { TemplateProps } from './types'

export default function({ name, dir, context }: TemplateProps): Object {
  return {
    path() {
      return path.resolve(dir, name)
    },
    context() {
      return context
    },
  }
}
