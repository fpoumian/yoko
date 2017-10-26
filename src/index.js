// @flow
/**
 * Yoko Core
 * @module yoko-core
 */

import EventEmitter from 'events'
import fs from 'fs-extra'
import nunjucks from 'nunjucks'
import prettier from 'prettier'
import NodeCache from 'node-cache'

import validateFilePlugin from './lib/plugin/validation'
import makeComponentFs from './lib/component/fs'
import makeGenerateComponentFn from './lib/component/generate'
import makeInitPlugins from './lib/plugin/init'
import makeMapPluginDataToFiles from './lib/plugin/mapToFiles'
import makeRenderTemplateFn from './lib/template/render'
import makeInitGenerator from './lib/generator/init'
import parseConfig from './lib/config/parse'
import normalizeConfig from './lib/config/normalize'
import validateConfig from './lib/config/validation'
import makeLoadPlugins from './lib/plugin/load'
import type { Config } from './lib/config/types'
import type { IGenerator } from './lib/generator/interfaces'
import type { ComponentOptions } from './lib/component/types'

/**
 *  Create Generator.
 *  @param {Object} [customConfig] - Global configuration object.
 */
export default function(customConfig: Object = {}): IGenerator {
  let config: Config

  try {
    config = parseConfig(normalizeConfig, validateConfig)(customConfig)
  } catch (e) {
    throw e
  }

  const initEmitter = new EventEmitter()
  const initCache = new NodeCache({ stdTTL: 100, checkPeriod: 120 })

  initEmitter.on('error', error => {
    if (process.env.NODE_ENV === 'test') {
      if (error.code === 'EBADF') {
        return
      }
    }
    console.error(error)
  })

  // Create and inject dependencies
  const loadPlugins = makeLoadPlugins(require, require.resolve, initEmitter)
  const componentFs = makeComponentFs(fs)
  const initGenerator = makeInitGenerator(initEmitter, initCache, loadPlugins)
  const renderTemplateFn = makeRenderTemplateFn(
    nunjucks,
    prettier,
    config.formatting.prettier,
    require
  )
  const generateComponentFn = makeGenerateComponentFn(
    componentFs,
    renderTemplateFn
  )

  // Public API

  /***
   * Add Event Listeners
   * @param {Object} eventName - The name of the event
   * @param eventHandler - Handler
   */
  function on(eventName: string, eventHandler: any) {
    return initEmitter.on(eventName, eventHandler)
  }

  /***
   * Generate component
   * @param {string} componentName - The name of the component
   * @param {Object} options - The options for the component
   */
  function generate(componentName: string, options: ComponentOptions = {}) {
    return initGenerator(config)({
      generateComponentFn,
      mapPluginsDataToFilesFn: makeMapPluginDataToFiles(
        componentFs.resolveComponentFileTemplate
      ),
      emitter: new EventEmitter(),
      makeInitPluginsFn: makeInitPlugins(validateFilePlugin),
    }).run(componentName, options)
  }

  return {
    on,
    generate,
  }
}
