// @flow
/* eslint import/prefer-default-export: off  */
import type { Component } from './types'

export function reduceComponentPaths(component: Component, paths: Object[]) {
  return paths.reduce(
    (newPaths: Object, pathObj: Object) => ({
      ...newPaths,
      ...pathObj,
    }),
    {
      root: component.getPath(),
    }
  )
}
