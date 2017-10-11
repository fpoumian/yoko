// @flow
import { find } from "lodash"

import type { ResolvedPlugin } from "./types"

export default function findUnresolvedPlugins(
  resolvedPlugins: Array<ResolvedPlugin>,
  pluginsNames: Array<string>
) {
  return pluginsNames.filter(
    pluginName => !find(resolvedPlugins, plugin => plugin.name === pluginName)
  )
}
