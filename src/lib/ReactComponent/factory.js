// @flow
import EventEmitter from "events"

import type { ReactComponentProps } from "./types"
import type { IReactComponent } from "./interfaces"
import type { IFile } from "../ComponentFile/interfaces"
import createReadable from "../Readable/factory"

export default (emitter: EventEmitter) => (
  props: ReactComponentProps,
  fileList: Map<string, IFile>
): IReactComponent => {
  const { name, path } = props

  // Public API
  const reactComponent: IReactComponent = {
    ...createReadable({
      name,
      path
    }),
    getFiles() {
      return fileList
    },
    getEmitter() {
      return emitter
    }
  }

  return reactComponent
}
