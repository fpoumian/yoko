// @flow
import path from "path"

import type { FileProps } from "../File/types"
import type { IFile } from "../File/interfaces"

export default function(props: FileProps, callback?: Function): IFile {
  // Public API
  const getName = () => props.name
  const getExtension = () => props.extension
  const getPath = () => {
    return path.resolve(props.dir, `${props.name}.${props.extension}`)
  }
  const getTemplatePath = () => props.templatePath
  const getRole = () => props.role

  if (callback) {
    callback()
  }

  return {
    getName,
    getPath,
    getTemplatePath,
    getExtension,
    getRole
  }
}
