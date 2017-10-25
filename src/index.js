// @flow
/**
 * Judex Component Generator
 * @module judex-component-generator
 */

import EventEmitter from 'events'
import fs from 'fs-extra'
import nunjucks from 'nunjucks'
import prettier from 'prettier'
import NodeCache from 'node-cache'

import validateFilePlugin from './lib/Plugin/validation'
import makeComponentFs from './lib/Component/fs'
import makeGenerateComponentFn from './lib/Component/generate'
import makeRenderTemplateFn from './lib/Template/render'
import makeInitGenerator from './lib/Generator/init'
import parseConfig from './lib/Config/parse'
import normalizeConfig from './lib/Config/normalize'
import validateConfig from './lib/Config/validation'
import makeLoadPlugins from './lib/Plugin/load'
import type { Config } from './lib/Config/types'
import type { IGenerator } from './lib/Generator/interfaces'
import type { ReactComponentOptions } from './lib/Component/types'

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
  function generate(
    componentName: string,
    options: ReactComponentOptions = {}
  ) {
    return initGenerator(config)({
      generateComponentFn,
      resolveComponentFileTemplateFn: componentFs.resolveComponentFileTemplate,
      emitter: new EventEmitter(),
      pluginValidator: {
        validate: validateFilePlugin,
      },
    }).run(componentName, options)
  }

  return {
    on,
    generate,
  }
}
