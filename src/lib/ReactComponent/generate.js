// @flow

import mkdirp from "mkdirp-promise"
import fse from "fs-extra"

import makeWriteComponentFiles from "./write"
import { reduceComponentPaths } from "./utils"
import type { ReactComponent } from "./types"
import type { writeFile } from "../ComponentFile/types"

function removeComponentRootDir(
  component: ReactComponent
): Promise<ReactComponent> {
  return fse.remove(component.getPath()).then(() => component)
}

function createComponentRootDir(
  component: ReactComponent
): Promise<ReactComponent> {
  return mkdirp(component.getPath()).then(() => {
    component.getEmitter().emit("componentRootDirCreated", {
      name: component.getName(),
      path: component.getPath()
    })
    return component
  })
}

export default (writeFile: writeFile) => (component: ReactComponent) => {
  const writeComponentFiles = makeWriteComponentFiles(writeFile)
  return removeComponentRootDir(component)
    .then(createComponentRootDir)
    .then(writeComponentFiles)
    .then((componentFilesPaths: Array<Object>) =>
      reduceComponentPaths(component, componentFilesPaths)
    )
    .catch(err => {
      throw err
    })
}
