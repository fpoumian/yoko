// @flow
import type { IComposable } from './interfaces'
import type { IReadable } from '../Readable/interfaces'

export type Component = IComposable & IReadable

export type ReactComponentProps = {
  name: string,
  path: string,
  type: string,
  main: boolean,
  index: boolean,
  stylesheet: boolean,
}

export type ReactComponentOptions = {
  container?: boolean,
  type?: string,
  main?: boolean,
  index?: boolean,
  stylesheet?: boolean,
  tests?: boolean,
}
