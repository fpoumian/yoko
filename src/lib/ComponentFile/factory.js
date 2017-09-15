// @flow
import path from "path"

import type { FileProps } from "./types"
import type { IFile } from "./interfaces"
import createReadable from "../Readable/factory"

export default function(props: FileProps): IFile {
  // Public API
  const componentFile: IFile = {
    ...createReadable({
      path: path.resolve(props.dir, `${props.name}.${props.extension}`),
      name: props.name
    }),
    getExtension() {
      return props.extension
    },
    getTemplate() {
      return props.template
    },
    getRole() {
      return props.role
    }
  }

  return componentFile
}
