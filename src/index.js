// @flow
import path from "path"

import createReactComponent from "./lib/ReactComponent/factory"
import createComponentFile from "./lib/ComponentFile/factory"
import type {
  ReactComponentProps,
  ReactComponentOptions
} from "./lib/ReactComponent/types"
import type { IReactComponent } from "./lib/ReactComponent/interfaces"
import { parseConfig } from "./lib/Config/utils"
import type { Config } from "./lib/Config/types"
import generateReactComponent from "./lib/ReactComponent/generate"

export default function(customConfig: Object = {}) {
  const config: Config = parseConfig(customConfig)

  // Public API
  const generate = function(
    componentName: string,
    options: ReactComponentOptions = {}
  ): Promise<any> {
    const splitName: Array<string> = componentName.split(path.sep)
    const componentHome = options.container
      ? config.paths.containers
      : config.paths.components

    const props: ReactComponentProps = {
      name: splitName[splitName.length - 1],
      path: path.resolve(componentHome, ...splitName),
      type: options.type || "sfc",
      index: options.index || false,
      stylesheet: options.stylesheet || false
    }

    const component: IReactComponent = createReactComponent(
      createComponentFile
    )(props, config)

    return generateReactComponent(component)
  }
  return {
    generate
  }
}
