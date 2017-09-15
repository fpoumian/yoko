// @flow
import type { IReactComponent } from "./interfaces"
import type { IReadable } from "../Readable/interfaces"

export type ReactComponent = IReactComponent & IReadable

export type ReactComponentProps = {
  name: string,
  path: string,
  type: string,
  index: boolean
}

export type ReactComponentOptions = {
  container?: boolean,
  type?: string,
  index?: boolean,
  stylesheet?: boolean,
  tests?: boolean
}

export type ReactComponentFileTemplatePaths = {
  main: string,
  index: string,
  tests: string
}
