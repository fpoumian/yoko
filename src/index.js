// @flow
/**
 * React Presto
 * @module react-presto
 */

import path from "path"
import EventEmitter from "events"
import { isPlainObject } from "lodash"
import { ArgumentError } from "common-errors"

import makeCreateReactComponent from "./lib/ReactComponent/factory"
import makeCreateFileList from "./lib/FileList/factory"
import createComponentFile from "./lib/ComponentFile/factory"
import type {
  ReactComponentProps,
  ReactComponentOptions,
  ReactComponentFileTemplatePaths,
  ReactComponent
} from "./lib/ReactComponent/types"
import parseConfig from "./lib/Config/parse"
import type { Config } from "./lib/Config/types"
import makeGenerateReactComponent from "./lib/ReactComponent/generate"
import writeFile from "./lib/ComponentFile/write"
import {
  getFilesTemplatesPaths,
  getComponentNameInfo
} from "./lib/ReactComponent/utils"
import type { IFile } from "./lib/ComponentFile/interfaces"

/**
 * @typedef {Object} PublicAPI
 * @property {Function} generate Generates a new React component.
 */
export interface IPublic {
  generate(name: string, options: ReactComponentOptions): EventEmitter
}

/**
 *  Initialize React Presto.
 *  @param {Object} [customConfig] - Global configuration object.
 *  @return {PublicAPI}
 */
export default function init(customConfig: Object = {}): IPublic {
  let config: Config

  try {
    config = parseConfig(customConfig)
  } catch (e) {
    throw e
  }

  /**
   * Generate a React component
   * @param {string} componentName - The name of the component you wish to generate.
   * @param {Object} [options] - The set of options you wish to use to generate this component.
   */
  const generate = function generate(
    componentName: string,
    options: ReactComponentOptions = {}
  ): EventEmitter {
    // Input error handling
    if (typeof componentName !== "string") {
      throw new TypeError(
        `You must provide a String type for the componentName argument. ${componentName
          .constructor.name} provided.`
      )
    }

    if (componentName === "") {
      throw new ArgumentError(
        `The componentName argument cannot be an empty string.`
      )
    }

    if (!isPlainObject(options)) {
      throw new TypeError(
        `You must provide a plain Object type for the options argument. ${options
          .constructor.name} provided.`
      )
    }

    // Prepare component props
    const { rootName, parentDirs } = getComponentNameInfo(componentName)
    const componentHome: string = options.container
      ? config.paths.containers
      : config.paths.components

    const props: ReactComponentProps = {
      name: rootName,
      path: path.resolve(componentHome, ...parentDirs, rootName),
      type: options.type || "sfc",
      index: options.index || false,
      stylesheet: options.stylesheet || false,
      tests: options.tests || false
    }

    // Get template paths
    const templatePaths: ReactComponentFileTemplatePaths = getFilesTemplatesPaths(
      config,
      props
    )

    // Create file list
    const createFileList = makeCreateFileList(createComponentFile)
    const fileList: Map<string, IFile> = createFileList(
      props,
      config,
      templatePaths
    )

    // Inject EventEmitter dependency
    const emitter: EventEmitter = new EventEmitter()
    const createReactComponent = makeCreateReactComponent(emitter)

    // Inject writeFile dependency
    const generateReactComponent = makeGenerateReactComponent(writeFile)

    // Create component in memory
    const component: ReactComponent = createReactComponent(props, fileList)
    const componentEmitter: EventEmitter = component.getEmitter()

    // Event handlers
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
      // process.exit(1)
    })

    // Start generating on the next tick
    process.nextTick(() => {
      componentEmitter.emit("start")
    })

    return componentEmitter
  }
  return {
    generate
  }
}
