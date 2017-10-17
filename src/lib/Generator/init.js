// @flow

import path from 'path'
import EventEmitter from 'events'

import createReactComponent from '../Component/factory'
import makeGenerateReactComponent from '../Component/generate'
import {
  validateComponentOptions,
  validateComponentPath,
} from '../Component/validation'
import makeInitPlugins from '../Plugin/init'
import registerPlugins from '../Plugin/register'
import parseComponentPath from '../Component/parsePath'
import makeMapFilePluginsDataToFiles from '../Plugin/mapToFiles'

import type { ComponentFile } from '../ComponentFile/types'
import type { LoadPluginsFn, Plugin } from '../Plugin/types'
import type {
  ReactComponentProps,
  ReactComponentOptions,
  Component,
} from '../Component/types'
import type { IFileSystem } from '../FileSystem/interfaces'
import type { ITemplateCompiler } from '../Template/interfaces'
import type { IGenerator } from './interfaces'
import type { IEventListener } from '../EventEmitter/interfaces'
import type { IFileFormatter } from '../ComponentFile/interfaces'

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
  ): (
    fs: IFileSystem,
    templateCompiler: ITemplateCompiler,
    fileFormatter: IFileFormatter
  ) => IGenerator {
    const registeredPlugins = registerPlugins(config)
    initEmitter.emit('pluginsRegistered', registeredPlugins)

    const plugins: Array<Plugin> = loadPlugins(registeredPlugins)
    initEmitter.emit('pluginsLoaded', plugins)

    // Inject generator dependencies
    return (
      fs: IFileSystem,
      templateCompiler: ITemplateCompiler,
      fileFormatter: IFileFormatter
    ) => {
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
        const validOptions = validateComponentOptions(options)
        const validComponentPath = validateComponentPath(componentPath)

        // Create new emitter
        const emitter: EventEmitter = new EventEmitter()
        emitter.on('error', error => {
          if (process.env.NODE_ENV === 'test') {
            if (error.code === 'EBADF') {
              return
            }
          }
          console.error(error)
        })

        // Kick-off component generation
        emitter.once('start', () => {
          const {
            rootName,
            parentDirs,
            componentName,
          } = parseComponentPath(validComponentPath, { ...config })

          const componentHome: string = validOptions.container
            ? config.paths.containers
            : config.paths.components

          const props: ReactComponentProps = {
            name: componentName,
            path: path.resolve(componentHome, ...parentDirs, rootName),
            type: validOptions.type || 'sfc',
            main: validOptions.main || true,
            index: validOptions.index || false,
            stylesheet: validOptions.stylesheet || false,
            tests: validOptions.tests || false,
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
          const component: Component = createReactComponent(props, files)

          const generateReactComponent = makeGenerateReactComponent(
            fs,
            emitter,
            templateCompiler,
            fileFormatter
          )

          // Kick-off component generation
          generateReactComponent(component, config)
            .then(paths => emitter.emit('done', paths))
            .catch(error => emitter.emit('error', error))
        })

        // Start generating on the next tick
        // so that client code can add event listeners
        // before component generation takes place.
        process.nextTick(() => {
          emitter.emit('start')
        })

        return {
          on(eventName, listener) {
            return emitter.on(eventName, listener)
          },
        }
      }

      return {
        generate,
      }
    }
  }
