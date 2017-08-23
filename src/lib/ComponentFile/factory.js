// @flow
import path from "path"

import type { FileProps } from "../File/types"
import type { IFile } from "../File/interfaces"

export default function(props: FileProps): IFile {
  const getName = () => props.name
  const getExtension = () => props.extension
  const getPath = () => {
    return path.resolve(props.dir, `${props.name}.${props.extension}`)
  }
  const getTemplateString = () => props.templateString
  const getRole = () => props.role

  return {
    getName,
    getPath,
    getTemplateString,
    getExtension,
    getRole
  }
}
