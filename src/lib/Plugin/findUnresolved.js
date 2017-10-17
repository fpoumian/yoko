// @flow
import find from 'lodash/find'

export default function findUnresolvedPlugins(
  resolvedPlugins: Array<Object>,
  pluginsNames: Array<string>
) {
  return pluginsNames.filter(
    pluginName => !find(resolvedPlugins, plugin => plugin.name === pluginName)
  )
}
