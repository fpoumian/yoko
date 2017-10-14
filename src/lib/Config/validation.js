// @flow

import isPlainObject from "lodash/isPlainObject"
import isString from "lodash/isString"
import get from "lodash/get"
import has from "lodash/has"
import template from "lodash/template"
import isBoolean from "lodash/isBoolean"
import isNull from "lodash/isNull"
import type { Config } from "./types"

function makeCreateTypeValidator({ validateFn, messageTypeLabel }) {
  const errorMessageTemplate = `You must pass ${messageTypeLabel} as a value for <%= path %> in the configuration object. <%= receivedType %> received instead.`

  return (value, path) => ({
    isValid: validateFn(value),
    ErrorClass: TypeError,
    errorMessage: template(errorMessageTemplate)({
      path,
      receivedType: get(
        value,
        "constructor.name",
        (isNull(value) && "Null") || typeof value
      )
    })
  })
}

function isStringOrPlainObject(value) {
  return isString(value) || isPlainObject(value)
}

function isBooleanOrPlainObject(value) {
  return isBoolean(value) || isPlainObject(value)
}

function validateConfigPath(
  config: Config,
  path: string,
  validatorFactory
): void {
  const value = get(config, path)
  const validator = validatorFactory(value, path)
  if (!validator.isValid) {
    throw new validator.ErrorClass(validator.errorMessage)
  }
}

function validateConfigPaths(config: Config, paths: string[], validator): void {
  paths
    .filter(path => has(config, path))
    .forEach(path => validateConfigPath(config, path, validator))
}

function validatePlainObjectPaths(config, paths) {
  const validatorFactory = makeCreateTypeValidator({
    validateFn: isPlainObject,
    messageTypeLabel: "an object"
  })
  validateConfigPaths(config, paths, validatorFactory)
}

function validateStringPaths(config, paths) {
  const validatorFactory = makeCreateTypeValidator({
    validateFn: isString,
    messageTypeLabel: "a string"
  })
  validateConfigPaths(config, paths, validatorFactory)
}

function validateStringOrPlainObjectPaths(config, paths) {
  const validatorFactory = makeCreateTypeValidator({
    validateFn: isStringOrPlainObject,
    messageTypeLabel: "a string or an object"
  })
  validateConfigPaths(config, paths, validatorFactory)
}

function validateBooleanPaths(config, paths) {
  const validatorFactory = makeCreateTypeValidator({
    validateFn: isBoolean,
    messageTypeLabel: "a boolean"
  })

  validateConfigPaths(config, paths, validatorFactory)
}

function validateBooleanOrPlainObjectPaths(config, paths) {
  const validatorFactory = makeCreateTypeValidator({
    validateFn: isBooleanOrPlainObject,
    messageTypeLabel: "a boolean or an object"
  })
  validateConfigPaths(config, paths, validatorFactory)
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
