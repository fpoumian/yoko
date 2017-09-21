// @flow
import fs from "fs"
import path from "path"

import resolveTemplateDir from "./resolveDir"
import type { Template, TemplateProps } from "./types"
import type { Config } from "../Config/types"

export default function(props: TemplateProps, config: Config): Template {
  const { name } = props
  const dir = resolveTemplateDir(fs.existsSync)(props.name, props.dir, config)
  return {
    getDir() {
      return dir
    },
    getPath() {
      return path.resolve(dir, name)
    }
  }
}
