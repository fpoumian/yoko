// @flow

import path from 'path'

import createComponent from '../component/factory'
import {
  validateComponentOptions,
  validateComponentName,
} from '../component/validation'
import registerPlugins from '../plugin/register'
import parseComponentName from '../component/parseName'

import type { ComponentFile, FileProps } from '../component-file/types'
import type { LoadPluginsFn, Plugin } from '../plugin/types'
import type {
  ComponentProps,
  ComponentOptions,
  Component,
} from '../component/types'
import type { IEventEmitter, IEventListener } from '../common/interfaces'
import reduceComponentPaths from '../component/reducePaths'
import type { ICache } from './interfaces'

export default (
  initEmitter: IEventEmitter,
  initCache: ICache,
  loadPluginsFn: LoadPluginsFn
) =>
  function init(config: Object): Function {
    initEmitter.emit('initGenerator')
    let plugins: Plugin[]

    const cachedPlugins = initCache.get('plugins')

    if (
      typeof cachedPlugins === 'undefined' ||
      process.env.NODE_ENV === 'test'
    ) {
      const registeredPlugins = registerPlugins(config)
      initEmitter.emit('pluginsRegistered', registeredPlugins)

      plugins = loadPluginsFn(registeredPlugins)
      initEmitter.emit('pluginsLoaded', plugins.map(plugin => plugin.name()))
      initCache.set('plugins', plugins)
    } else {
      plugins = cachedPlugins
    }

    // Inject run dependencies
    return ({
      generateComponentFn,
      mapPluginsDataToFilesFn,
      makeInitPluginsFn,
      emitter,
    }) => {
      function run(
        componentName: string,
        options: ComponentOptions = {}
      ): IEventListener {
        // Handle input errors
        let validOptions
        let validComponentName

        try {
          validOptions = validateComponentOptions(options)
          validComponentName = validateComponentName(componentName)
        } catch (e) {
          throw e
        }

        // Create new emitter
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
          } = parseComponentName(validComponentName, { ...config })

          // Resolve component Home Directory
          const componentHome: string = validOptions.container
            ? config.paths.containers
            : config.paths.components

          // Resolve component props
          const props: ComponentProps = {
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
          const initPlugins = makeInitPluginsFn(emitter)
          const pluginsData: FileProps[] = initPlugins(
            plugins,
            { ...props },
            { ...config }
          )

          // Map plugin data to files
          const files: ComponentFile[] = mapPluginsDataToFilesFn(pluginsData, {
            ...config,
          })

          // Create component
          const component: Component = createComponent(props, files)

          // Kick-off component generation
          return generateComponentFn(component, config)
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
            emitter.on(eventName, listener)
            return this
          },
          then(cb: any => any) {
            return new Promise((resolve, reject) => {
              emitter.on('done', paths => resolve(cb(paths)))
              emitter.on('error', err => reject(cb(err)))
            })
          },
        }
      }

      return {
        run,
      }
    }
  }
