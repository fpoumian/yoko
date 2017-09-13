// @flow
import path from "path"
import EventEmitter from "events"

import makeCreateReactComponent from "./lib/ReactComponent/factory"
import makeCreateFileList from "./lib/FileList/factory"
import createComponentFile from "./lib/ComponentFile/factory"
import type {
  ReactComponentProps,
  ReactComponentOptions,
  ReactComponentFileTemplatePaths
} from "./lib/ReactComponent/types"
import type { IReactComponent } from "./lib/ReactComponent/interfaces"
import parseConfig from "./lib/Config/parse"
import type { Config } from "./lib/Config/types"
import makeGenerateReactComponent from "./lib/ReactComponent/generate"
import writeFile from "./lib/File/write"
import { getFilesTemplatesPaths } from "./lib/ReactComponent/utils"
import type { IFile } from "./lib/File/interfaces"

/**
 *  Create a generator
 */
export default function(customConfig: Object = {}) {
  const config: Config = parseConfig(customConfig)

  /**
   * Generate a React component
   */
  const generate = function generate(
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
      stylesheet: options.stylesheet || false,
      tests: options.tests || false
    }

    const templatePaths: ReactComponentFileTemplatePaths = getFilesTemplatesPaths(
      config,
      props
    )

    const createFileList = makeCreateFileList(createComponentFile)
    const fileList: Map<string, IFile> = createFileList(
      props,
      config,
      templatePaths
    )

    const emitter: EventEmitter = new EventEmitter()
    const createReactComponent = makeCreateReactComponent(emitter)
    const component: IReactComponent = createReactComponent(props, fileList)

    const generateReactComponent = makeGenerateReactComponent(writeFile)
    const componentEmitter: EventEmitter = component.getEmitter()

    componentEmitter.once("start", () => {
      generateReactComponent(component)
        .then(paths => component.getEmitter().emit("done", paths))
        .catch(error => component.getEmitter().emit("error", error))
    })

    componentEmitter.on("error", error => {
      if (process.env.NODE_ENV === "test") {
        if (error.code === "EBADF") {
          return
        }
      }
      console.error(error)
      process.exit(1)
    })

    process.on("uncaughtException", err => {
      console.error(err)
      process.exit(1)
    })

    process.nextTick(() => {
      componentEmitter.emit("start")
    })

    return componentEmitter
  }
  return {
    generate
  }
}
