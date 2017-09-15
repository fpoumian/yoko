// @flow
import EventEmitter from "events"

import type { ReactComponent, ReactComponentProps } from "./types"
import type { IFile } from "../ComponentFile/interfaces"
import createReadable from "../Readable/factory"

export default (emitter: EventEmitter) => (
  props: ReactComponentProps,
  fileList: Map<string, IFile>
): ReactComponent => {
  const { name, path } = props

  // Public API
  const reactComponent: ReactComponent = {
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
