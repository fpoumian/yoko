// @flow
import path from "path"

import type { ComponentFile, FileProps } from "./types"
import createReadable from "../Readable/factory"
import createTemplate from "../Template/factory"
import type { Config } from "../Config/types"

export default function(props: FileProps, config: Config): ComponentFile {
  const { name, extension, role } = props
  const template = props.template
    ? createTemplate(props.template, config)
    : null

  // Public API
  const componentFile: ComponentFile = {
    ...createReadable({
      path: path.resolve(props.dir, `${props.name}.${props.extension}`),
      name
    }),
    getExtension() {
      return extension
    },
    getTemplate() {
      return template
    },
    getRole() {
      return role
    }
  }

  return componentFile
}
