// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import type { LoadedPlugin, ResolvedPlugin } from "./types"

interface ILoader {
  require(string): any
}

export default (loader: ILoader) =>
  function loadPlugins(plugins: Array<ResolvedPlugin>): Array<LoadedPlugin> {
    return plugins.reduce(
      (loadedPluginsAcc: Array<LoadedPlugin>, plugin: ResolvedPlugin) => {
        const temp = { ...plugin }
        try {
          temp.init = loader.require(plugin.path)
          return [...loadedPluginsAcc, temp]
        } catch (e) {
          throw e
        }
      },
      []
    )
  }
