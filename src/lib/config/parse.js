// @flow

import merge from 'lodash/merge'
import isPlainObject from 'lodash/isPlainObject'

import type { Config } from './types'
import defaultConfig from './default'

export default (normalizeFn: Function, validateFn: Function) =>
  function parseConfig(config: Object): Config {
    if (!isPlainObject(config)) {
      throw new TypeError(
        `You must provide a plain object type as the configuration argument. ${config
          .constructor.name} provided.`
      )
    }

    // If no custom config was provided in argument (i.e. an empty object)
    if (Object.keys(config).length === 0) {
      // return all the default config values
      return defaultConfig
    }
    // otherwise validate and normalize the custom config
    // and then merge it with the default config
    try {
      return merge({}, defaultConfig, normalizeFn(validateFn(config)))
    } catch (e) {
      throw e
    }
  }
