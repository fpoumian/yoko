// @flow

import type { IReadable } from './interfaces'
import type { ReadableProps } from './types'

export default function({ name, path }: ReadableProps): IReadable {
  const Readable: IReadable = {
    getName() {
      return name
    },
    getPath() {
      return path
    },
  }
  return Readable
}
