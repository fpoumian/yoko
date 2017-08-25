// @flow
import mkdirp from "mkdirp-promise"
import path from "path"

import createReactComponent from "./lib/ReactComponent/factory"
import type { ReactComponentProps } from "./lib/ReactComponent/types"
import type { IReactComponent } from "./lib/ReactComponent/interfaces"
import writeComponentFiles from "./lib/ReactComponent/write-component-files"
import { reduceComponentPaths } from "./lib/ReactComponent/utils"
import { parseConfig } from "./lib/Config/utils"
import type { Config } from "./lib/Config/types"

export default function(customConfig: Object = {}) {
  const config: Config = parseConfig(customConfig)

  const createComponentDir = function(
    component: IReactComponent
  ): Promise<IReactComponent> {
    return mkdirp(component.getPath()).then(() => component)
  }

  // Public API
  const generate = function(componentName: string): Promise<any> {
    const splitName: Array<string> = componentName.split(path.sep)

    const props: ReactComponentProps = {
      name: splitName[splitName.length - 1],
      path: path.resolve(config.paths.components, ...splitName)
    }

    const component: IReactComponent = createReactComponent(
      props,
      config
    )

    return createComponentDir(component)
      .then(writeComponentFiles)
      .then((componentFilesPaths: Array<Object>) => {
        return reduceComponentPaths(component, componentFilesPaths)
      })
  }
  return {
    generate
  }
}
