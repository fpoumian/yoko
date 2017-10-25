// @flow

import type { Plugin } from './types'
import constants from './constants'

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
    getPrefixedName() {
      return `${constants.PLUGIN_PREFIX}-${name}`
    },
    init,
  }
}
