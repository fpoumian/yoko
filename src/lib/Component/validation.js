// @flow
import isString from 'lodash/isString'
import isValid from 'is-valid-path'
import filenameReservedRegex from 'filename-reserved-regex'
import Joi from 'joi'
import isWindows from 'is-windows'

import type { ReactComponentOptions } from './types'
import BadOptionsError from '../Errors/BadOptionsError'

export function validateComponentOptions(
  options: ReactComponentOptions
): ReactComponentOptions {
  const schema = Joi.object().keys({
    container: Joi.boolean().strict(),
    main: Joi.boolean().strict(),
    index: Joi.boolean().strict(),
    stylesheet: Joi.boolean().strict(),
    tests: Joi.boolean().strict(),
    es6class: Joi.boolean().strict(),
  })

  const { error, value } = Joi.validate(options, schema)
  if (error) {
    throw new BadOptionsError(error.details[0].message)
  }
  return value
}

export function validateComponentPath(componentPath: string): string {
  if (!isString(componentPath)) {
    throw new TypeError(
      `You must pass a string as a value for the componentName argument. ${componentPath
        .constructor.name} received instead.`
    )
  }

  if (componentPath.trim() === '') {
    throw new Error(`The componentName argument cannot be an empty string.`)
  }

  if (!isValid(componentPath)) {
    throw new Error(
      'The componentName argument contains an invalid character. Please remove it and try again.'
    )
  }

  // Check for reserved words in Windows
  if (isWindows()) {
    if (filenameReservedRegex.windowsNames().test(componentPath)) {
      throw new Error(
        'The componentName argument you passed contains a reserved character. Please remove it and try again.'
      )
    }
  }

  return componentPath
}
