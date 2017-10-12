// @flow

import type { Plugin } from "./types"

export default function createPlugin(
  name: string,
  path: string,
  init: any => any
): Plugin {
  return {
    getName() {
      return name
    },
    getPath() {
      return path
    },
    init
  }
}
