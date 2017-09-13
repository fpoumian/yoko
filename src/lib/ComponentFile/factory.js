// @flow
import path from "path"

import type { FileProps } from "../File/types"
import type { IFile } from "../File/interfaces"

export default function(props: FileProps): IFile {
  // Public API
  const componentFile: IFile = {
    getName() {
      return props.name
    },
    getExtension() {
      return props.extension
    },
    getPath() {
      return path.resolve(props.dir, `${props.name}.${props.extension}`)
    },
    getTemplatePath() {
      return props.templatePath
    },
    getRole() {
      return props.role
    }
  }

  return componentFile
}
