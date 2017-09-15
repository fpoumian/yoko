// @flow

import createReadable from "../Readable/factory"
import type { Template, TemplateProps } from "./types"

export default function(props: TemplateProps): Template {
  const { path, name } = props
  return {
    ...createReadable({ path, name })
  }
}
