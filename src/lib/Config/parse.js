// @flow

import path from 'path'
import get from 'lodash/get'
import merge from 'lodash/merge'
import mapValues from 'lodash/mapValues'
import isPlainObject from 'lodash/isPlainObject'

import type { Config } from './types'
import defaultConfig from './default'
import validateConfig from './validation'

function normalizePath(originalPath: string): string {
  if (!originalPath) return ''
  return path.isAbsolute(originalPath)
    ? originalPath
    : path.resolve(...originalPath.trim().split(path.sep))
}

function normalizePaths(originalPaths: Object): Object {
  return mapValues(originalPaths, path => normalizePath(path))
}

function normalizeExtension(originalExt: string): string {
  if (!originalExt || typeof originalExt === 'undefined') return ''
  return originalExt.trim().replace(/^(\.)/, '')
}

function normalizeExtensions(originalExtensions: Object): Object {
  return mapValues(originalExtensions, value => normalizeExtension(value))
}

function normalizeConfig(config) {
  const normalizedPaths = normalizePaths(get(config, 'paths'))
  const normalizedJSExtensions = normalizeExtensions(
    get(config, 'extensions.js')
  )
  const normalizedStylesheetExtensions = normalizeExtensions(
    get(config, 'extensions.stylesheet')
  )

  return {
    ...config,

    paths: {
      ...normalizedPaths,
    },

    extensions: {
      js: {
        ...normalizedJSExtensions,
      },
      stylesheet: {
        ...normalizedStylesheetExtensions,
      },
    },
  }
}

export default function(config: Object): Config {
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
    return merge({}, defaultConfig, normalizeConfig(validateConfig(config)))
  } catch (e) {
    throw e
  }
}
