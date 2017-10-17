// @flow
import find from 'lodash/find'

export default function findUnresolvedPlugins(
  resolvedPlugins: Object[],
  pluginsNames: string[]
) {
  return pluginsNames.filter(
    pluginName => !find(resolvedPlugins, plugin => plugin.name === pluginName)
  )
}
