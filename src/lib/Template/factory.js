// @flow
import path from "path"

import type { Template, TemplateProps } from "./types"

export default function(props: TemplateProps): Template {
  const { name, dir } = props
  return {
    getDir() {
      return dir
    },
    getPath() {
      return path.resolve(dir, name)
    }
  }
}
