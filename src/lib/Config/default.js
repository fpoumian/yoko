// @flow

import path from "path"
import type { Config } from "./types"

const config: Config = {
  paths: {
    components: path.resolve(process.cwd(), "components"),
    containers: path.resolve(process.cwd(), "containers")
  },
  extensions: {
    js: {
      main: "js",
      index: "js"
    },
    stylesheet: {
      main: "css"
    }
  }
}

export default config
