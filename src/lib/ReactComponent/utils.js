// @flow
/* eslint import/prefer-default-export: off  */
import type { ReactComponent } from "./types"

export function reduceComponentPaths(
  component: ReactComponent,
  paths: Array<Object>
) {
  return paths.reduce(
    (newPaths: Object, pathObj: Object) => ({
      ...newPaths,
      ...pathObj
    }),
    {
      root: component.getPath()
    }
  )
}
