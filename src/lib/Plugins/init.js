// @flow

import type { LoadedPlugin } from "./types"
import type { ReactComponentProps } from "../ReactComponent/types"
import type { Config } from "../Config/types"
import validateFilePlugin from "./validation"

export default () =>
  function initPlugins(
    plugins: Array<LoadedPlugin>,
    props: ReactComponentProps,
    config: Config
  ): Array<Object> {
    const initialized = plugins.reduce(
      (accInitialized: Array<Object>, plugin: LoadedPlugin) => {
        try {
          const fileProps = validateFilePlugin(plugin, props, config)
          return [
            ...accInitialized,
            {
              fileProps,
              name: plugin.name,
              path: plugin.path
            }
          ]
        } catch (e) {
          throw e
        }
      },
      []
    )
    return initialized
  }
