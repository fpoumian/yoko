// @flow
import type { IComposable } from './interfaces'
import type { IReadable } from '../Readable/interfaces'

export type Component = IComposable & IReadable

export type ReactComponentProps = {
  name: string,
  path: string,
  es6class: boolean,
  main: boolean,
  index: boolean,
  stylesheet: boolean,
}

export type ReactComponentOptions = {
  container?: boolean,
  main?: boolean,
  index?: boolean,
  es6class?: boolean,
  stylesheet?: boolean,
  tests?: boolean,
}
