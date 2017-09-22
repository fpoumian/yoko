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
import type {
  ReactComponentProps,
  ReactComponentOptions,
  ReactComponent
} from "./lib/ReactComponent/types"
import parseConfig from "./lib/Config/parse"
import type { Config } from "./lib/Config/types"
import makeGenerateReactComponent from "./lib/ReactComponent/generate"
import makeResolvePlugins from "./lib/Plugins/resolve"
import makeLoadPlugins from "./lib/Plugins/load"
import makeInitPlugins from "./lib/Plugins/init"
import registerPlugins from "./lib/Plugins/register"
import writeFile from "./lib/ComponentFile/write"
import { getComponentNameInfo } from "./lib/ReactComponent/utils"
import type { ComponentFile } from "./lib/ComponentFile/types"
import mapPluginsToFiles from "./lib/Plugins/mapToFiles"
import type { LoadedPlugin, Object, ResolvedPlugin } from "./lib/Plugins/types"

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
   * @param {string} componentPath - The path of the component you wish to generate.
   * @param {Object} [options] - The set of options you wish to use to generate this component.
   */
  const generate = function generate(
    componentPath: string,
    options: ReactComponentOptions = {}
  ): EventEmitter {
    // Error handling
    if (typeof componentPath !== "string") {
      throw new TypeError(
        `You must provide a String type for the componentName argument. ${componentPath
          .constructor.name} provided.`
      )
    }

    if (componentPath === "") {
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
    const { rootName, parentDirs, componentName } = getComponentNameInfo(
      componentPath,
      config
    )
    const componentHome: string = options.container
      ? config.paths.containers
      : config.paths.components

    // const { type, main, index, stylesheet, tests } = options

    const props: ReactComponentProps = {
      name: componentName,
      path: path.resolve(componentHome, ...parentDirs, rootName),
      type: options.type || "sfc",
      main: options.main || true,
      index: options.index || false,
      stylesheet: options.stylesheet || false,
      tests: options.tests || false
    }

    const emitter: EventEmitter = new EventEmitter()
    emitter.on("error", error => {
      if (process.env.NODE_ENV === "test") {
        if (error.code === "EBADF") {
          return
        }
      }
      console.error(error)
    })

    // Register plugins
    const registeredPlugins = registerPlugins({ ...config })

    // Resolve plugins
    const resolvePlugins = makeResolvePlugins(
      { resolve: require.resolve },
      emitter
    )
    const resolvedPlugins: Array<ResolvedPlugin> = resolvePlugins([
      ...registeredPlugins
    ])

    // Load plugins
    const loadPlugins = makeLoadPlugins({ require }, emitter)
    const plugins: Array<LoadedPlugin> = loadPlugins(resolvedPlugins)

    // Initialize plugins
    const initPlugins = makeInitPlugins(emitter)
    const initializedPlugins = initPlugins(plugins, { ...props }, { ...config })

    // Map plugins to files
    const files: Array<ComponentFile> = mapPluginsToFiles(
      initializedPlugins,
      config
    )

    // Create component
    const createReactComponent = makeCreateReactComponent(emitter)
    const component: ReactComponent = createReactComponent(props, files)

    const componentEmitter: EventEmitter = component.getEmitter()

    const generateReactComponent = makeGenerateReactComponent(writeFile)

    // Event handlers
    componentEmitter.once("start", () => {
      generateReactComponent(component)
        .then(paths => component.getEmitter().emit("done", paths))
        .catch(error => component.getEmitter().emit("error", error))
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
