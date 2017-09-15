// @flow
import path from "path"

import type { FileProps } from "./types"
import type { IFile } from "./interfaces"
import createReadable from "../Readable/factory"

export default function(props: FileProps): IFile {
  const { name, extension, template, role } = props

  // Public API
  const componentFile: IFile = {
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
