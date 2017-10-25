// @flow
import type { IHasFiles } from './interfaces'
import type { IHasPath } from '../common/interfaces'

export type Component = IHasFiles & IHasPath

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
