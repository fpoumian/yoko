// @flow

import type { FileProps } from "../ComponentFile/types"
import type { ReactComponentProps } from "../ReactComponent/types"
import type { Config } from "../Config/types"

export type ResolvedPlugin = {
  path: string,
  name: string
}

export type LoadedPlugin = {
  init: (props?: ReactComponentProps, config?: Config) => FileProps,
  path: string,
  name: string
}

export type Object = {
  path: string,
  fileProps: FileProps,
  name: string
}

export type Loader = {
  require: (path: string) => Object
}

export type Resolver = {
  resolve: (path: string) => string
}
