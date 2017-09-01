// @flow
import mkdirp from "mkdirp-promise"
import fse from "fs-extra"
import path from "path"

import createReactComponent from "./lib/ReactComponent/factory"
import type {
  ReactComponentProps,
  ReactComponentOptions
} from "./lib/ReactComponent/types"
import type { IReactComponent } from "./lib/ReactComponent/interfaces"
import writeComponentFiles from "./lib/ReactComponent/write-component-files"
import { reduceComponentPaths } from "./lib/ReactComponent/utils"
import { parseConfig } from "./lib/Config/utils"
import type { Config } from "./lib/Config/types"

export default function(customConfig: Object = {}) {
  const config: Config = parseConfig(customConfig)

  const removeComponentDir = function(
    component: IReactComponent
  ): Promise<IReactComponent> {
    return fse.remove(component.getPath()).then(() => component)
  }

  const createComponentDir = function(
    component: IReactComponent
  ): Promise<IReactComponent> {
    return mkdirp(component.getPath()).then(() => component)
  }

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

    const component: IReactComponent = createReactComponent(props, config)

    return removeComponentDir(component)
      .then(createComponentDir)
      .then(writeComponentFiles)
      .then((componentFilesPaths: Array<Object>) => {
        return reduceComponentPaths(component, componentFilesPaths)
      })
      .catch(console.error)
  }
  return {
    generate
  }
}
