// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import EventEmitter from "events"
import type { ResolvedPlugin, Resolver } from "./types"
import constants from "./constants"

export default (resolver: Resolver, emitter: EventEmitter) =>
  function resolvePlugins(pluginsNames: Array<string>): Array<ResolvedPlugin> {
    return pluginsNames.reduce(
      (pluginsAcc: Array<ResolvedPlugin>, pluginName: string) => {
        let plugin
        try {
          plugin = {
            path: resolver.resolve(`${constants.PLUGIN_PREFIX}-${pluginName}`),
            name: pluginName
          }
          return [...pluginsAcc, plugin]
        } catch (e) {
          emitter.emit("error", `Cannot find plugin ${pluginName}.`)
        }
        return pluginsAcc
      },
      []
    )
  }
