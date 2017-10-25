// @flow

import path from 'path'

import createComponent from '../component/factory'
import {
  validateComponentOptions,
  validateComponentName,
} from '../component/validation'
import makeInitPlugins from '../plugin/init'
import registerPlugins from '../plugin/register'
import parseComponentName from '../component/parseName'
import makeMapFilePluginsDataToFiles from '../plugin/mapToFiles'

import type { ComponentFile, FileProps } from '../ComponentFile/types'
import type { LoadPluginsFn, Plugin } from '../plugin/types'
import type {
  ComponentProps,
  ComponentOptions,
  Component,
} from '../component/types'
import type { IEventEmitter, IEventListener } from '../common/interfaces'
import type { RunDependencies } from './types'
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

    if (typeof cachedPlugins === 'undefined') {
      const registeredPlugins = registerPlugins(config)
      initEmitter.emit('pluginsRegistered', registeredPlugins)

      plugins = loadPluginsFn(registeredPlugins)
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
        componentName: string,
        options: ComponentOptions = {}
      ): IEventListener {
        // Handle input errors
        const validOptions = validateComponentOptions(options)
        const validComponentName = validateComponentName(componentName)

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
