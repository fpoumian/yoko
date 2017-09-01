import type { IFile } from "../File/interfaces"

export type ReactComponentProps = {
  name: string,
  path: string,
  type: string,
  index: boolean
}

export type ReactComponentPaths = {
  root: string,
  main: string,
  index?: string,
  stylesheet?: string
}

export type ReactComponentOptions = {
  container?: boolean,
  type?: string,
  index?: boolean,
  stylesheet?: boolean
}

export type ReactComponentFiles = {
  mainFile: IFile,
  indexFile?: IFile,
  stylesheetFile?: IFile
}

export type ReactComponentFileTemplatePaths = {
  main: string,
  index: string
}
