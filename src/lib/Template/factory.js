// @flow

import type { ITemplate } from "./interfaces"
import createReadable from "../Readable/factory"
import type { TemplateProps } from "./types"

export default function(props: TemplateProps): ITemplate {
  const { path, name } = props
  return {
    ...createReadable({ path, name })
  }
}
