// @flow
import isString from "lodash/isString"
import isPlainObject from "lodash/isPlainObject"

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

  return componentPath
}
