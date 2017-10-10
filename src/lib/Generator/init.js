// @flow

import path from "path"
import EventEmitter from "events"
import { isPlainObject } from "lodash"
import fs from "fs-extra"

import makeCreateReactComponent from "../ReactComponent/factory"

import type {
  ReactComponentProps,
  ReactComponentOptions,
  ReactComponent
} from "../ReactComponent/types"
import makeGenerateReactComponent from "../ReactComponent/generate"
import initPlugins from "../Plugins/init"
import registerPlugins from "../Plugins/register"
import findUnresolvedPlugins from "../Plugins/findUnresolved"
import parseComponentPath from "../ReactComponent/parsePath"
import type { ComponentFile } from "../ComponentFile/types"
import mapPluginsToFiles from "../Plugins/mapToFiles"
import type {
  LoadedPlugin,
  LoadPluginsFn,
  ResolvedPlugin,
  ResolvePluginsFn
} from "../Plugins/types"

/**
 * @typedef {Object} PublicAPI
 * @property {Function} generate Generates a new React component.
 */
export interface IPublic {
  generate(name: string, options: ReactComponentOptions): EventEmitter
}

/**
 *  Inject init dependencies.
 *  @param {Object} initEmitter - EventEmitter
 *  @param {Function} resolvePlugins - Function to resolve plugins
 *  @param {Function} loadPlugins - Function to load plugins
 *  @return {PublicAPI}
 */
export default (
  initEmitter: EventEmitter,
  resolvePlugins: ResolvePluginsFn,
  loadPlugins: LoadPluginsFn
) =>
  /**
   *  Init generator.
   *  @param {Object} config - Global Configuration
   *  @return {PublicAPI}
   */
  function init(config: Object): IPublic {
    const registeredPlugins = registerPlugins({ ...config })
    initEmitter.emit("pluginsRegistered", registeredPlugins)

    const resolvedPlugins: Array<ResolvedPlugin> = resolvePlugins(
      registeredPlugins
    )
    initEmitter.emit("pluginsResolved", resolvedPlugins)

    findUnresolvedPlugins(
      resolvedPlugins,
      registeredPlugins
    ).forEach(pluginName => {
      initEmitter.emit(
        "error",
        `Unable to find plugin ${pluginName}. Are you sure it's installed?`
      )
    })

    const plugins: Array<LoadedPlugin> = loadPlugins(resolvedPlugins)
    initEmitter.emit("pluginsLoaded", plugins)

    /**
   * Generate a React component
   * @param {string} componentPath - The path of the component you wish to generate.
   * @param {Object} [options] - The set of options you wish to use to generate this component.
   */
    const generate = function generate(
      componentPath: string,
      options: ReactComponentOptions = {}
    ): EventEmitter {
      if (typeof componentPath !== "string") {
        throw new TypeError(
          `You must provide a String type for the componentName argument. ${componentPath
            .constructor.name} provided.`
        )
      }

      if (componentPath.trim() === "") {
        throw new Error(`The componentName argument cannot be an empty string.`)
      }

      if (!isPlainObject(options)) {
        throw new TypeError(
          `You must provide a plain Object type as the options argument. ${options
            .constructor.name} provided.`
        )
      }

      // Parse component path and assign to props
      const {
        rootName,
        parentDirs,
        componentName
      } = parseComponentPath(componentPath, { ...config })

      const componentHome: string = options.container
        ? config.paths.containers
        : config.paths.components

      const props: ReactComponentProps = {
        name: componentName,
        path: path.resolve(componentHome, ...parentDirs, rootName),
        type: options.type || "sfc",
        main: options.main || true,
        index: options.index || false,
        stylesheet: options.stylesheet || false,
        tests: options.tests || false
      }

      const componentEmitter: EventEmitter = new EventEmitter()
      componentEmitter.on("error", error => {
        if (process.env.NODE_ENV === "test") {
          if (error.code === "EBADF") {
            return
          }
        }
        console.error(error)
      })

      // Initialize plugins
      const initializedPlugins = initPlugins(
        plugins,
        { ...props },
        { ...config }
      )

      // Map plugins to files
      const files: Array<ComponentFile> = mapPluginsToFiles(
        initializedPlugins,
        config
      )

      // Create component
      const createReactComponent = makeCreateReactComponent()
      const component: ReactComponent = createReactComponent(props, files)

      const generateReactComponent = makeGenerateReactComponent(
        fs,
        componentEmitter
      )

      // Event handlers
      componentEmitter.once("start", () => {
        generateReactComponent(component)
          .then(paths => componentEmitter.emit("done", paths))
          .catch(error => componentEmitter.emit("error", error))
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
