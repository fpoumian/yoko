// @flow

import path from "path"
import type { Config } from "./types"

const config: Config = {
  paths: {
    components: path.resolve(process.cwd(), "components"),
    containers: path.resolve(process.cwd(), "containers"),
    templates: ""
  },
  extensions: {
    js: {
      main: "js",
      index: "js",
      tests: "test.js"
    },
    stylesheet: {
      main: "css"
    }
  }
}

export default config
