// @flow

import path from 'path'
import get from 'lodash/get'
import mapValues from 'lodash/mapValues'
import type { Config } from './types'

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
  return originalExt.trim().replace(/^(\.)/, '')
}

function normalizeExtensions(originalExtensions: Object): Object {
  return mapValues(originalExtensions, value => normalizeExtension(value))
}

export default function normalizeConfig(config: Config) {
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
