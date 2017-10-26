// @flow

import constants from './constants'

export default function createPlugin(
  name: string,
  path: string,
  init: any => any
): Object {
  return {
    name() {
      return name
    },
    path() {
      return path
    },
    prefixedName() {
      return `${constants.PLUGIN_PREFIX}-${this.name()}`
    },
    init,
  }
}
