// @flow
import mkdirp from "mkdirp-promise"
import path from "path"

import { IConfig } from "./lib/Interfaces/Config"
import createReactComponent from "./lib/ReactComponent/factory"
import type { ReactComponentProps } from "./lib/ReactComponent/types"
import type { IReactComponent } from "./lib/ReactComponent/interfaces"
import writeComponentFiles from "./lib/ReactComponent/write-component-files"

export default function(config: IConfig) {
  const componentsPath = config.paths.components || "components"
  const componentExtension = config.extension || "js"
  const componentsHome: string = path.join(process.cwd(), componentsPath)

  const createDir = function(
    component: IReactComponent
  ): Promise<IReactComponent> {
    return mkdirp(component.getPath()).then(() => component)
  }

  const generate = function(
    componentName: string,
    options?: Object
  ): Promise<any> {
    const splitName: Array<string> = componentName.split(path.sep)

    const props: ReactComponentProps = {
      name: splitName[splitName.length - 1],
      path: path.resolve(componentsHome, ...splitName)
    }

    const component: IReactComponent = createReactComponent(
      props,
      componentsHome
    )

    return createDir(component)
      .then(writeComponentFiles)
      .then(filesWritten => (filesWritten ? component.getPath() : null))
  }
  return {
    generate
  }
}
