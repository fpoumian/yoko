// @flow

import type { Config } from "../Config/types"

export default function registerPlugins(config: Config): Array<string> {
  return [
    // register default plugins
    "main-file",
    "index-file",
    "stylesheet-file",
    // register user specified plugins
    ...(config.plugins || [])
  ]
}
