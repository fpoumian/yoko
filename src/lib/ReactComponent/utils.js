// @flow
import type {IReactComponent} from "./interfaces";

export function reduceComponentPaths(component: IReactComponent, paths: Array<Object>) {
  return paths.reduce(
    (paths: Object, pathObj: Object) => {
      return {
        ...paths,
        ...pathObj
      }
    },
    {
      root: component.getPath()
    }
  )
}
