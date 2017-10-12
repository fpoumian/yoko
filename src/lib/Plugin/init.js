// @flow

import EventEmitter from "events"

import type { LoadedPlugin } from "./types"
import type { ReactComponentProps } from "../ReactComponent/types"
import type { Config } from "../Config/types"
import validateFilePlugin from "./validation"
import constants from "./constants"

export default (emitter: EventEmitter) =>
  function initPlugins(
    plugins: Array<LoadedPlugin>,
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
            name: plugin.name,
            path: plugin.path
          }
        ]
      } catch (e) {
        emitter.emit(
          "error",
          `Cannot initialize plugin ${constants.PLUGIN_PREFIX}-${plugin.name}.
        Problem: ${e}
        `
        )
        return acc
      }
    }, [])
  }
