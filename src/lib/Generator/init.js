// @flow

import path from "path"
import EventEmitter from "events"
import isPlainObject from "lodash/isPlainObject"

import createReactComponent from "../ReactComponent/factory"
import makeGenerateReactComponent from "../ReactComponent/generate"
import makeInitPlugins from "../Plugin/init"
import registerPlugins from "../Plugin/register"
import parseComponentPath from "../ReactComponent/parsePath"
import makeMapFilePluginsDataToFiles from "../Plugin/mapToFiles"

import type { ComponentFile } from "../ComponentFile/types"
import type { LoadPluginsFn, Plugin } from "../Plugin/types"
import type {
  ReactComponentProps,
  ReactComponentOptions,
  ReactComponent
} from "../ReactComponent/types"
import type { IFileSystem } from "../FileSystem/interfaces"
import type { ITemplateCompiler } from "../Template/interfaces"
import type { IGenerator } from "./interfaces"
import type { IEventListener } from "../EventEmitter/interfaces"

/**
 * @typedef {Object} IGenerator
 * @property {Function} generate Generates a new React component.
 */

/**
 *  Inject init dependencies.
 *  @param {Object} initEmitter - EventEmitter
 *  @param {Function} loadPlugins - Function to load plugins
 *  @return {IGenerator}
 */
export default (initEmitter: EventEmitter, loadPlugins: LoadPluginsFn) =>
  /**
   *  Init generator.
   *  @param {Object} config - Global Configuration
   *  @return {IGenerator}
   */
  function init(
    config: Object
  ): (fs: IFileSystem, templateCompiler: ITemplateCompiler) => IGenerator {
    const registeredPlugins = registerPlugins(config)
    initEmitter.emit("pluginsRegistered", registeredPlugins)

    const plugins: Array<Plugin> = loadPlugins(registeredPlugins)
    initEmitter.emit("pluginsLoaded", plugins)

    // Inject generator dependencies
    return (fs: IFileSystem, templateCompiler: ITemplateCompiler) => {
      /**
       * Generate a React component
       * @param {string} componentPath - The path of the component you wish to generate.
       * @param {Object} [options] - The set of options you wish to use to generate this component.
       */
      function generate(
        componentPath: string,
        options: ReactComponentOptions = {}
      ): IEventListener {
        // Handle input errors
        if (typeof componentPath !== "string") {
          throw new TypeError(
            `You must provide a String type for the componentName argument. ${componentPath
              .constructor.name} provided.`
          )
        }

        if (componentPath.trim() === "") {
          throw new Error(
            `The componentName argument cannot be an empty string.`
          )
        }

        if (!isPlainObject(options)) {
          throw new TypeError(
            `You must provide a plain Object type as the options argument. ${options
              .constructor.name} provided.`
          )
        }

        // Create new emitter
        const emitter: EventEmitter = new EventEmitter()
        emitter.on("error", error => {
          if (process.env.NODE_ENV === "test") {
            if (error.code === "EBADF") {
              return
            }
          }
          console.error(error)
        })

        // Kick-off component generation
        emitter.once("start", () => {
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

          // Initialize plugins
          const initPlugins = makeInitPlugins(emitter)
          const filePluginsData: Array<Object> = initPlugins(
            plugins,
            { ...props },
            { ...config }
          )

          // Map plugins to files
          const mapFilePluginsDataToFiles = makeMapFilePluginsDataToFiles(fs)
          const files: ComponentFile[] = mapFilePluginsDataToFiles(
            filePluginsData,
            { ...config }
          )

          // Create component
          const component: ReactComponent = createReactComponent(props, files)

          const generateReactComponent = makeGenerateReactComponent(
            fs,
            emitter,
            templateCompiler
          )

          // Kick-off component generation
          generateReactComponent(component)
            .then(paths => emitter.emit("done", paths))
            .catch(error => emitter.emit("error", error))
        })

        // Start generating on the next tick
        // so that client code can add event listeners
        // before component generation takes place.
        process.nextTick(() => {
          emitter.emit("start")
        })

        return {
          on(eventName, listener) {
            return emitter.on(eventName, listener)
          }
        }
      }

      return {
        generate
      }
    }
  }
