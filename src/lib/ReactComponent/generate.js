// @flow

import EventEmitter from "events"

import makeWriteComponentFiles from "./write"
import { reduceComponentPaths } from "./utils"
import type { ReactComponent } from "./types"
import type { IFileSystem } from "../FileSystem/interfaces"

const makeRemoveComponentRootDir = (fs: IFileSystem) =>
  function removeComponentRootDir(
    component: ReactComponent
  ): Promise<ReactComponent> {
    return fs.remove(component.getPath()).then(() => component)
  }

const makeCreateComponetRootDir = (fs: IFileSystem) =>
  function createComponentRootDir(
    component: ReactComponent
  ): Promise<ReactComponent> {
    return fs.ensureDir(component.getPath()).then(() => component)
  }

export default (fs: IFileSystem, emitter: EventEmitter) =>
  function generateComponent(component: ReactComponent) {
    const writeComponentFiles = makeWriteComponentFiles(fs)
    const removeComponentRootDir = makeRemoveComponentRootDir(fs)
    const createComponentRootDir = makeCreateComponetRootDir(fs)

    return removeComponentRootDir(component)
      .then(createComponentRootDir)
      .then(writeComponentFiles)
      .then((componentFilesPaths: Array<Object>) => {
        componentFilesPaths.forEach(filePath => {
          Object.keys(filePath).forEach(role => {
            emitter.emit("fileWritten", filePath[role])
            emitter.emit(`${role}FileWritten`, filePath[role])
          })
        })
        return componentFilesPaths
      })
      .then((componentFilesPaths: Array<Object>) =>
        reduceComponentPaths(component, componentFilesPaths)
      )
      .catch(err => {
        throw err
      })
  }
