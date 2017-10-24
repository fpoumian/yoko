// @flow

import path from 'path'
import EventEmitter from 'events'

import createComponent from '../Component/factory'
import {
  validateComponentOptions,
  validateComponentPath,
} from '../Component/validation'
import makeInitPlugins from '../Plugin/init'
import registerPlugins from '../Plugin/register'
import parseComponentPath from '../Component/parsePath'
import makeMapFilePluginsDataToFiles from '../Plugin/mapToFiles'

import type { ComponentFile, FileProps } from '../ComponentFile/types'
import type { LoadPluginsFn, Plugin } from '../Plugin/types'
import type {
  ReactComponentProps,
  ReactComponentOptions,
  Component,
} from '../Component/types'
import type { IEventListener } from '../EventEmitter/interfaces'
import type { RunDependencies } from './types'
import reduceComponentPaths from '../Component/reducePaths'

export default (
  initEmitter: EventEmitter,
  initCache: Object,
  loadPlugins: LoadPluginsFn
) =>
  function init(config: Object): Function {
    initEmitter.emit('initGenerator')
    let plugins: Plugin[]

    const cachedPlugins = initCache.get('plugins')

    if (typeof cachedPlugins === 'undefined') {
      const registeredPlugins = registerPlugins(config)
      initEmitter.emit('pluginsRegistered', registeredPlugins)

      plugins = loadPlugins(registeredPlugins)
      initEmitter.emit('pluginsLoaded', plugins.map(plugin => plugin.getName()))
      initCache.set('plugins', plugins)
    } else {
      plugins = cachedPlugins
    }

    // Inject generator dependencies
    return ({
      generateComponentFn,
      resolveComponentFileTemplateFn,
      pluginValidator,
      emitter,
    }: RunDependencies) => {
      function run(
        componentPath: string,
        options: ReactComponentOptions = {}
      ): IEventListener {
        // Handle input errors
        const validOptions = validateComponentOptions(options)
        const validComponentPath = validateComponentPath(componentPath)

        // Create new emitter
        // const emitter: EventEmitter = new EventEmitter()
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

          // Resolve Component Home Directory
          const componentHome: string = validOptions.container
            ? config.paths.containers
            : config.paths.components

          // Resolve component props
          const props: ReactComponentProps = {
            name: componentName,
            path: path.resolve(componentHome, ...parentDirs, rootName),
            main: validOptions.main || true,
            es6class:
              (validOptions.container &&
                config.rules['es6class-container-component']) ||
              (validOptions.es6class || false),
            index: validOptions.index || false,
            stylesheet: validOptions.stylesheet || false,
            tests: validOptions.tests || false,
          }

          // Initialize plugins
          const initPlugins = makeInitPlugins(emitter, pluginValidator)
          const filePluginsData: FileProps[] = initPlugins(
            plugins,
            { ...props },
            { ...config }
          )

          // Map plugins to files
          const mapFilePluginsDataToFiles = makeMapFilePluginsDataToFiles(
            resolveComponentFileTemplateFn
          )
          const files: ComponentFile[] = mapFilePluginsDataToFiles(
            filePluginsData,
            { ...config }
          )

          // Create component
          const component: Component = createComponent(props, files)

          // Kick-off component generation
          generateComponentFn(component, config)
            .then((componentFilesPaths: Object[]) => {
              componentFilesPaths.forEach(filePath => {
                Object.keys(filePath).forEach(role => {
                  emitter.emit('fileWritten', filePath[role])
                  emitter.emit(`${role}FileWritten`, filePath[role])
                })
              })
              return componentFilesPaths
            })
            .then((componentFilesPaths: Object[]) =>
              reduceComponentPaths(component, componentFilesPaths)
            )
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
        run,
      }
    }
  }
