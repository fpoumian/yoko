// @flow
import EventEmitter from "events"

import type { ReactComponent, ReactComponentProps } from "./types"
import createReadable from "../Readable/factory"
import type { ComponentFile } from "../ComponentFile/types"

export default (emitter: EventEmitter) =>
  function createReactComponent(
    props: ReactComponentProps,
    files: Array<ComponentFile>
  ): ReactComponent {
    const { name, path } = props
    const filesMap: Map<string, ComponentFile> = new Map()

    // Add file if requested on props
    files.forEach(file => {
      if (props[file.getRole()]) {
        filesMap.set(file.getRole(), file)
      }
    })

    // Public API
    const reactComponent: ReactComponent = {
      ...createReadable({
        name,
        path
      }),
      getFiles() {
        return filesMap
      },
      getEmitter() {
        return emitter
      }
    }

    return reactComponent
  }
