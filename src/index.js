// @flow
/**
 * Judex Component Generator
 * @module judex-component-generator
 */

import EventEmitter from "events"
import fs from "fs-extra"
import nunjucks from "nunjucks"

import makeInitGenerator from "./lib/Generator/init"
import parseConfig from "./lib/Config/parse"
import type { ReactComponentOptions } from "./lib/ReactComponent/types"
import type { Config } from "./lib/Config/types"
import makeResolvePlugins from "./lib/Plugins/resolve"
import makeLoadPlugins from "./lib/Plugins/load"

// Setup event emitter
const initEmitter = new EventEmitter()

initEmitter.on("error", error => {
  if (process.env.NODE_ENV === "test") {
    if (error.code === "EBADF") {
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
 * @typedef {Object} PublicAPI
 * @property {Function} generate Generates a new React component.
 */
export interface IPublic {
  generate(name: string, options: ReactComponentOptions): EventEmitter
}

/**
 *  Initialize Generator.
 *  @param {Object} [customConfig] - Global configuration object.
 */
export default function(customConfig: Object = {}): IPublic {
  let config: Config

  try {
    config = parseConfig(customConfig)
  } catch (e) {
    throw e
  }

  const resolvePlugins = makeResolvePlugins({ resolve: require.resolve })
  const loadPlugins = makeLoadPlugins({ require })

  const initGenerator = makeInitGenerator(
    initEmitter,
    resolvePlugins,
    loadPlugins
  )
  return initGenerator(config)(fs, nunjucks)
}
