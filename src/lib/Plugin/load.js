// @flow

import EventEmitter from 'events'

import type { Plugin } from './types'
import constants from './constants'
import createPlugin from './factory'

export default (
  require: string => any,
  resolve: string => string,
  emitter: EventEmitter
) =>
  function loadPlugins(pluginNames: string[]): Plugin[] {
    return pluginNames.reduce((acc, pluginName) => {
      const pluginFullName = `${constants.PLUGIN_PREFIX}-${pluginName}`
      try {
        return [
          ...acc,
          createPlugin(
            pluginName,
            resolve(pluginFullName),
            require(pluginFullName)
          ),
        ]
      } catch (e) {
        emitter.emit('cannotLoadPlugin', pluginFullName)
      }
      return acc
    }, [])
  }
