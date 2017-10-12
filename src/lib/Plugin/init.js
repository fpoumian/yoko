// @flow

import EventEmitter from "events"

import type { Plugin } from "./types"
import type { ReactComponentProps } from "../ReactComponent/types"
import type { Config } from "../Config/types"
import validateFilePlugin from "./validation"
import constants from "./constants"

export default (emitter: EventEmitter) =>
  function initPlugins(
    plugins: Array<Plugin>,
    props: ReactComponentProps,
    config: Config
  ): Array<Object> {
    return plugins.reduce((acc, plugin) => {
      try {
        const fileProps = validateFilePlugin(plugin, props, config)
        return [
          ...acc,
          {
            fileProps,
            name: plugin.getName(),
            path: plugin.getPath()
          }
        ]
      } catch (e) {
        emitter.emit(
          "error",
          `Cannot initialize plugin ${constants.PLUGIN_PREFIX}-${plugin.getName()}.
           Problem: ${e}
           `
        )
        return acc
      }
    }, [])
  }
