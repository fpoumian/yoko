// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import EventEmitter from "events"
import type { Loader, LoadedPlugin, ResolvedPlugin } from "./types"

export default (loader: Loader, emitter: EventEmitter) =>
  function loadPlugins(plugins: Array<ResolvedPlugin>): Array<LoadedPlugin> {
    return plugins.reduce(
      (loadedPluginsAcc: Array<LoadedPlugin>, plugin: ResolvedPlugin) => {
        const temp = { ...plugin }
        try {
          temp.init = loader.require(plugin.path)
          return [...loadedPluginsAcc, temp]
        } catch (e) {
          emitter.emit("error", `Cannot load plugin ${plugin.name}.`)
        }

        return loadedPluginsAcc
      },
      []
    )
  }
