import mkdirp from "mkdirp-promise"
import fse from "fs-extra"

import type { IReactComponent } from "./interfaces"
import writeComponentFiles from "./write-component-files"
import { reduceComponentPaths } from "./utils"

const removeComponentDir = function(
  component: IReactComponent
): Promise<IReactComponent> {
  return fse.remove(component.getPath()).then(() => component)
}

const createComponentDir = function(
  component: IReactComponent
): Promise<IReactComponent> {
  return mkdirp(component.getPath()).then(() => component)
}

export default function(component: IReactComponent) {
  return removeComponentDir(component)
    .then(createComponentDir)
    .then(writeComponentFiles)
    .then((componentFilesPaths: Array<Object>) => {
      return reduceComponentPaths(component, componentFilesPaths)
    })
}
