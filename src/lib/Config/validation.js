// @flow

import isPlainObject from "lodash/isPlainObject"
import isString from "lodash/isString"
import get from "lodash/get"
import has from "lodash/has"
import template from "lodash/template"
import isBoolean from "lodash/isBoolean"
import isNull from "lodash/isNull"
import type { Config } from "./types"

function createTypeValidator({ validateFn, messageTypeLabel }) {
  return {
    validateFn,
    ErrorClass: TypeError,
    messageTypeLabel,
    errorMessageTemplate: `You must pass ${messageTypeLabel} as a value for <%= path %> in the configuration object. <%= receivedType %> received instead.`
  }
}

function isStringOrPlainObject(value) {
  return isString(value) || isPlainObject(value)
}

function isBooleanOrPlainObject(value) {
  return isBoolean(value) || isPlainObject(value)
}

function validateConfigPath(config: Config, path: string, validator): void {
  const value = get(config, path)
  const errorMessage = template(validator.errorMessageTemplate)({
    path,
    receivedType: get(
      value,
      "constructor.name",
      (isNull(value) && "Null") || typeof value
    )
  })
  if (!validator.validateFn(value)) {
    throw new validator.ErrorClass(errorMessage)
  }
}

function validateConfigPaths(config: Config, paths: string[], validator): void {
  paths
    .filter(path => has(config, path))
    .forEach(path => validateConfigPath(config, path, validator))
}

function validatePlainObjectPaths(config, paths) {
  const validator = createTypeValidator({
    validateFn: isPlainObject,
    messageTypeLabel: "an object"
  })
  validateConfigPaths(config, paths, validator)
}

function validateStringPaths(config, paths) {
  const validator = createTypeValidator({
    validateFn: isString,
    messageTypeLabel: "a string"
  })
  validateConfigPaths(config, paths, validator)
}

function validateStringOrPlainObjectPaths(config, paths) {
  const validator = createTypeValidator({
    validateFn: isStringOrPlainObject,
    messageTypeLabel: "a string or an object"
  })
  validateConfigPaths(config, paths, validator)
}

function validateBooleanPaths(config, paths) {
  const validator = createTypeValidator({
    validateFn: isBoolean,
    messageTypeLabel: "a boolean"
  })

  validateConfigPaths(config, paths, validator)
}

function validateBooleanOrPlainObjectPaths(config, paths) {
  const validator = createTypeValidator({
    validateFn: isBooleanOrPlainObject,
    messageTypeLabel: "a boolean or an object"
  })
  validateConfigPaths(config, paths, validator)
}

export default function(config: Config): Config {
  validatePlainObjectPaths(config, [
    "paths",
    "extensions",
    "rules",
    "formatting"
  ])

  validateStringPaths(config, [
    "paths.components",
    "paths.containers",
    "paths.templates"
  ])

  validateStringOrPlainObjectPaths(config, [
    "extensions.js",
    "extensions.stylesheet"
  ])

  validateBooleanPaths(config, ["rules.component-name-root-dir"])

  validateBooleanOrPlainObjectPaths(config, ["formatting.prettier"])

  return config
}
