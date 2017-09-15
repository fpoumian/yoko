// @flow

import type { IReadable } from "./interfaces"
import type { ReadableProps } from "./types"

export default function(props: ReadableProps): IReadable {
  const Readable: IReadable = {
    getName() {
      return props.name
    },
    getPath() {
      return props.path
    }
  }
  return Readable
}
