// @flow
/**
 * Judex Component Generator
 * @module judex-component-generator
 */

import EventEmitter from 'events'
import fs from 'fs-extra'
import nunjucks from 'nunjucks'
import prettier from 'prettier'

import validateFilePlugin from './lib/Plugin/validation'
import makeComponentFs from './lib/Component/fs'
import makeGenerateComponentFn from './lib/Component/generate'
import makeInitGenerator from './lib/Generator/init'
import parseConfig from './lib/Config/parse'
import normalizeConfig from './lib/Config/normalize'
import validateConfig from './lib/Config/validation'
import type { Config } from './lib/Config/types'
import makeLoadPlugins from './lib/Plugin/load'
import type { IGenerator } from './lib/Generator/interfaces'
import type { ReactComponentOptions } from './lib/Component/types'

/**
 *  Create Generator.
 *  @param {Object} [customConfig] - Global configuration object.
 */
export default function(customConfig: Object = {}): IGenerator {
  let config: Config
  const initEmitter = new EventEmitter()

  try {
    config = parseConfig(normalizeConfig, validateConfig)(customConfig)
  } catch (e) {
    throw e
  }

  initEmitter.on('error', error => {
    if (process.env.NODE_ENV === 'test') {
      if (error.code === 'EBADF') {
        return
      }
    }
    console.error(error)
  })

  const loadPlugins = makeLoadPlugins(
    { require },
    { resolve: require.resolve },
    initEmitter
  )

  function on(eventName: string, eventHandler: any) {
    return initEmitter.on(eventName, eventHandler)
  }

  const componentFs = makeComponentFs(fs)
  const initGenerator = makeInitGenerator(initEmitter, loadPlugins)
  const generateComponentFn = makeGenerateComponentFn(
    componentFs,
    nunjucks,
    prettier
  )

  function generate(
    componentPath: string,
    options: ReactComponentOptions = {}
  ) {
    return initGenerator(config)({
      generateComponentFn,
      resolveComponentFileTemplateFn: componentFs.resolveComponentFileTemplate,
      emitter: new EventEmitter(),
      pluginValidator: {
        validate: validateFilePlugin,
      },
    }).run(componentPath, options)
  }

  return {
    on,
    generate,
  }
}
