// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import EventEmitter from "events"

import type { LoadedPlugin } from "./types"
import constants from "./constants"

interface ILoader {
  require(string): any
}

interface IResolver {
  resolve(string): string
}

export default (loader: ILoader, resolver: IResolver, emitter: EventEmitter) =>
  function loadPlugins(pluginNames: Array<string>): Array<LoadedPlugin> {
    return pluginNames.reduce((acc, pluginName) => {
      const pluginFullName = `${constants.PLUGIN_PREFIX}-${pluginName}`
      try {
        return [
          ...acc,
          {
            name: pluginName,
            path: resolver.resolve(pluginFullName),
            init: loader.require(pluginFullName)
          }
        ]
      } catch (e) {
        emitter.emit("error", `Cannot load plugin ${pluginName}`)
      }
      return acc
    }, [])
  }
