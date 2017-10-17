// @flow
/**
 * Judex Component Generator
 * @module judex-component-generator
 */

import EventEmitter from 'events'
import fs from 'fs-extra'
import nunjucks from 'nunjucks'
import prettier from 'prettier'

import makeInitGenerator from './lib/Generator/init'
import parseConfig from './lib/Config/parse'
import type { Config } from './lib/Config/types'
import makeLoadPlugins from './lib/Plugin/load'
import type { IGenerator } from './lib/Generator/interfaces'

// Setup event emitters
const initEmitter = new EventEmitter()

initEmitter.on('error', error => {
  if (process.env.NODE_ENV === 'test') {
    if (error.code === 'EBADF') {
      return
    }
  }
  console.error(error)
})

/**
 *  Add Event Listeners.
 *  @param {string} [eventName] - The name of the event.
 *  @param {Function} [listener] - The listener function.
 */
export function addEventListener(
  eventName: string,
  listener: any => any
): void {
  initEmitter.addListener(eventName, listener)
}

/**
 *  Initialize Generator.
 *  @param {Object} [customConfig] - Global configuration object.
 */
export default function(customConfig: Object = {}): IGenerator {
  let config: Config

  try {
    config = parseConfig(customConfig)
  } catch (e) {
    throw e
  }

  const loadPlugins = makeLoadPlugins(
    { require },
    { resolve: require.resolve },
    initEmitter
  )

  const initGenerator = makeInitGenerator(initEmitter, loadPlugins)
  return initGenerator(config)(fs, nunjucks, prettier)
}
