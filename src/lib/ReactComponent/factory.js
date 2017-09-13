// @flow
import EventEmitter from "events"

import type { ReactComponentProps } from "./types"
import type { IReactComponent } from "./interfaces"
import type { IFile } from "../File/interfaces"

export default (emitter: EventEmitter) => (
  props: ReactComponentProps,
  fileList: Map<string, IFile>
): IReactComponent => {
  const { name, path } = props

  // Public API
  const reactComponent: IReactComponent = {
    getName() {
      return name
    },
    getPath() {
      return path
    },
    getFiles() {
      return fileList
    },
    getEmitter() {
      return emitter
    }
  }

  return reactComponent
}
