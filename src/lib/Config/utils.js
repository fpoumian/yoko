// @flow

import path from "path"
import { get, merge, mapValues } from "lodash"

import type { Config } from "./types"
import defaultConfig from "./default"

function normalizePath(originalPath: string): string {
  if (!originalPath || typeof originalPath === "undefined") return ""
  return path.resolve(...originalPath.trim().split(path.sep))
}

function normalizePaths(originalPaths: Object): Object {
  return mapValues(originalPaths, value => normalizePath(value))
}

function normalizeExtensions(originalExtensions: Object): Object {
  return mapValues(originalExtensions, value => normalizeExtension(value))
}

function normalizeExtension(originalExt: string): string {
  if (!originalExt || typeof originalExt === "undefined") return ""
  return originalExt.trim().replace(".", "")
}

function normalizeConfig(config) {
  const normalizedPaths = normalizePaths(get(config, "paths"))
  const normalizedJSExtensions = normalizeExtensions(
    get(config, "extensions.js")
  )
  const normalizedStylesheetExtensions = normalizeExtensions(
    get(config, "extensions.stylesheet")
  )

  return {
    ...config,

    paths: {
      ...normalizedPaths
    },

    extensions: {
      js: {
        ...normalizedJSExtensions
      },
      stylesheet: {
        ...normalizedStylesheetExtensions
      }
    }
  }
}

export function parseConfig(config: Object): Config {
  if (Object.keys(config).length === 0) {
    return merge({}, defaultConfig, config)
  }
  return merge({}, defaultConfig, normalizeConfig(config))
}
