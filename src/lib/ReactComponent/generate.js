// @flow

import mkdirp from "mkdirp-promise"
import fse from "fs-extra"

import makeWriteComponentFiles from "./write"
import { reduceComponentPaths } from "./utils"
import type { ReactComponent } from "./types"
import type { writeFile } from "../ComponentFile/types"
import type {IFileSystem} from "../FileSystem/interfaces";

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

export default (fs: IFileSystem) => (component: ReactComponent) => {
  const writeComponentFiles = makeWriteComponentFiles(fs)
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
