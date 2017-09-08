// @flow
import path from "path"
import EventEmitter from "events"

import createReactComponent from "./lib/ReactComponent/factory"
import createComponentFile from "./lib/ComponentFile/factory"
import type {
  ReactComponentProps,
  ReactComponentOptions
} from "./lib/ReactComponent/types"
import type { IReactComponent } from "./lib/ReactComponent/interfaces"
import { parseConfig } from "./lib/Config/utils"
import type { Config } from "./lib/Config/types"
import makeGenerateReactComponent from "./lib/ReactComponent/generate"
import writeFile from "./lib/File/write"

export default function(customConfig: Object = {}) {
  const config: Config = parseConfig(customConfig)

  // Public API
  const generate = function(
    componentName: string,
    options: ReactComponentOptions = {}
  ): EventEmitter {
    const splitName: Array<string> = componentName.split(path.sep)
    const componentHome: string = options.container
      ? config.paths.containers
      : config.paths.components

    const props: ReactComponentProps = {
      name: splitName[splitName.length - 1],
      path: path.resolve(componentHome, ...splitName),
      type: options.type || "sfc",
      index: options.index || false,
      stylesheet: options.stylesheet || false
    }

    const emitter: EventEmitter = new EventEmitter()
    const component: IReactComponent = createReactComponent(
      createComponentFile,
      emitter
    )(props, config)

    const generateReactComponent = makeGenerateReactComponent(writeFile)
    const componentEmitter: EventEmitter = component.getEmitter()

    componentEmitter.once("start", (component: IReactComponent) => {
      generateReactComponent(component)
        .then(paths => {
          return component.getEmitter().emit("done", paths)
        })
        .catch(error => {
          return component.getEmitter().emit("error", error)
        })
    })

    componentEmitter.on("error", error => {
      if (process.env.NODE_ENV === "test") {
        if (error.code === "EBADF") {
          return null
        }
      } else {
        console.error(error)
      }
    })

    process.nextTick(() => {
      componentEmitter.emit("start", component)
    })

    return componentEmitter
  }
  return {
    generate
  }
}
