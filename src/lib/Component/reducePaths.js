// @flow
import type { Component } from './types'

export default function reduceComponentPaths(
  component: Component,
  paths: Object[]
) {
  return paths.reduce(
    (acc, pathObj) => ({
      ...acc,
      ...pathObj,
    }),
    {
      root: component.getPath(),
    }
  )
}
