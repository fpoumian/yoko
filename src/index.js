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
  ): Promise<any> {
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

    const emitter = new EventEmitter()

    const component: IReactComponent = createReactComponent(
      createComponentFile,
      emitter
    )(props, config)

    const generateReactComponent = makeGenerateReactComponent(writeFile)

    component.getEmitter().on("start", (component: IReactComponent) => {
      console.log(component.getName())
    })

    component.getEmitter().emit("start", component)

    return generateReactComponent(component)
  }
  return {
    generate
  }
}
