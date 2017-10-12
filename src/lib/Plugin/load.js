// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import EventEmitter from "events"

import type { Plugin } from "./types"
import constants from "./constants"
import createPlugin from "./factory"

interface ILoader {
  require(string): any
}

interface IResolver {
  resolve(string): string
}

export default (loader: ILoader, resolver: IResolver, emitter: EventEmitter) =>
  function loadPlugins(pluginNames: Array<string>): Array<Plugin> {
    return pluginNames.reduce((acc, pluginName) => {
      const pluginFullName = `${constants.PLUGIN_PREFIX}-${pluginName}`
      try {
        return [
          ...acc,
          createPlugin(
            pluginName,
            resolver.resolve(pluginFullName),
            loader.require(pluginFullName)
          )
        ]
      } catch (e) {
        emitter.emit("error", `Cannot load plugin ${pluginName}`)
      }
      return acc
    }, [])
  }
