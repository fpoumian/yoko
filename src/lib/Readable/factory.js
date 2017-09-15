// @flow

import type { IReadable } from "./interfaces"
import type { ReadableProps } from "./types"

export default function(props: ReadableProps): IReadable {
  const { name, path } = props
  const Readable: IReadable = {
    getName() {
      return name
    },
    getPath() {
      return path
    }
  }
  return Readable
}
