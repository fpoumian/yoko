// @flow
import type { IComposable } from './interfaces'
import type { IReadable } from '../Readable/interfaces'

export type Component = IComposable & IReadable

export type ComponentProps = {
  name: string,
  path: string,
  es6class: boolean,
  main: boolean,
  index: boolean,
  stylesheet: boolean,
}

export type ComponentOptions = {
  container?: boolean,
  main?: boolean,
  index?: boolean,
  es6class?: boolean,
  stylesheet?: boolean,
  tests?: boolean,
}
