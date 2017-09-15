// @flow

import mkdirp from "mkdirp-promise"
import fse from "fs-extra"

import type { IReactComponent } from "./interfaces"
import makeWriteComponentFiles from "./write"
import { reduceComponentPaths } from "./utils"
import type { IFile } from "../ComponentFile/interfaces"

function removeComponentDir(
  component: IReactComponent
): Promise<IReactComponent> {
  return fse.remove(component.getPath()).then(() => component)
}

function createComponentDir(
  component: IReactComponent
): Promise<IReactComponent> {
  return mkdirp(component.getPath()).then(() => {
    component.getEmitter().emit("componentDirCreated", {
      name: component.getName(),
      path: component.getPath()
    })
    return component
  })
}

export default (writeFile: (file: IFile, data: string) => Promise<string>) => (
  component: IReactComponent
) => {
  const writeComponentFiles = makeWriteComponentFiles(writeFile)
  return removeComponentDir(component)
    .then(createComponentDir)
    .then(writeComponentFiles)
    .then((componentFilesPaths: Array<Object>) =>
      reduceComponentPaths(component, componentFilesPaths)
    )
    .catch(err => {
      throw err
    })
}
