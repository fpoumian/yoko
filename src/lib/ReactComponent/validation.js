// @flow
import isString from "lodash/isString"
import isPlainObject from "lodash/isPlainObject"
import isValid from "is-valid-path"
import filenameReservedRegex from "filename-reserved-regex"
import isWindows from "is-windows"

import type { ReactComponentOptions } from "./types"
import createObjectValidator from "../Utils/validation"

const objectValidator = createObjectValidator("component options object")

export function validateComponentOptions(
  options: ReactComponentOptions
): ReactComponentOptions {
  if (!isPlainObject(options)) {
    throw new TypeError(
      `You must pass an object as the options argument. ${options.constructor
        .name} received instead.`
    )
  }

  objectValidator.validateBooleanPaths(options, [
    "container",
    "main",
    "index",
    "stylesheet",
    "tests"
  ])

  objectValidator.validateStringPaths(options, ["type"])

  return options
}

export function validateComponentPath(componentPath: string): string {
  if (!isString(componentPath)) {
    throw new TypeError(
      `You must pass a string as a value for the componentName argument. ${componentPath
        .constructor.name} received instead.`
    )
  }

  if (componentPath.trim() === "") {
    throw new Error(`The componentName argument cannot be an empty string.`)
  }

  if (!isValid(componentPath)) {
    throw new Error(
      "The componentName argument contains an invalid character. Please remove it and try again."
    )
  }

  // Check for reserved words in Windows
  if (isWindows()) {
    if (filenameReservedRegex.windowsNames().test(componentPath)) {
      throw new Error(
        "The componentName argument you passed contains a reserved character. Please remove it and try again."
      )
    }
  }

  return componentPath
}
