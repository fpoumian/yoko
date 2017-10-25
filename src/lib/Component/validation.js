// @flow
import isString from 'lodash/isString'
import isValid from 'is-valid-path'
import filenameReservedRegex from 'filename-reserved-regex'
import Joi from 'joi'
import isWindows from 'is-windows'

import type { ReactComponentOptions } from './types'
import BadOptionsError from '../Errors/BadOptionsError'
import BadNameError from '../Errors/BadNameError'

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

export function validateComponentName(componentName: string): string {
  if (!isString(componentName)) {
    throw new BadNameError(
      `You must pass a string as a value for the componentName argument. ${componentName
        .constructor.name} received instead.`
    )
  }

  if (componentName.trim() === '') {
    throw new BadNameError(
      `The componentName argument cannot be an empty string.`
    )
  }

  if (!isValid(componentName)) {
    throw new BadNameError(
      'The componentName argument contains an invalid character. Please remove it and try again.'
    )
  }

  // Check for reserved words in Windows
  if (isWindows()) {
    if (filenameReservedRegex.windowsNames().test(componentName)) {
      throw new BadNameError(
        'The componentName argument you passed contains a reserved character. Please remove it and try again.'
      )
    }
  }

  return componentName
}
