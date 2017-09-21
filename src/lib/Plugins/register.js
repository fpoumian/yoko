// @flow

import type { Config } from "../Config/types"

export default function registerPlugins(config: Config): Array<string> {
  return [
    "main-file",
    "index-file",
    "stylesheet-file",
    // "tests-file",
    ...(config.plugins || [])
  ]
}
