// @flow

import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'
import get from 'lodash/get'
import has from 'lodash/has'
import template from 'lodash/template'
import isBoolean from 'lodash/isBoolean'
import isNull from 'lodash/isNull'

interface IValidator {
  isValid((any) => boolean): boolean;
  getErrorClass(): Function;
  getErrorMessage(): string;
}

export default function(context: string) {
  function makeCreateTypeValidator({ validateFn, messageTypeLabel }) {
    const errorMessageTemplate = `You must pass ${messageTypeLabel} as a value for <%= path %> in the ${context}. <%= receivedType %> received instead.`

    return (value, path): IValidator => ({
      isValid: validateFn(value),
      getErrorClass() {
        return TypeError
      },
      getErrorMessage() {
        return template(errorMessageTemplate)({
          path,
          receivedType: get(
            value,
            'constructor.name',
            (isNull(value) && 'Null') || typeof value
          ),
        })
      },
    })
  }

  function isStringOrPlainObject(value) {
    return isString(value) || isPlainObject(value)
  }

  function isBooleanOrPlainObject(value) {
    return isBoolean(value) || isPlainObject(value)
  }

  function validateObjectPath(
    object: Object,
    path: string,
    validatorFactory
  ): void {
    const value = get(object, path)
    const validator: IValidator = validatorFactory(value, path)
    const ErrorClass = validator.getErrorClass()
    if (!validator.isValid) {
      throw new ErrorClass(validator.getErrorMessage())
    }
  }

  function validateObjectPaths(
    object: Object,
    paths: string[],
    validatorFactory: (any, string) => IValidator
  ): void {
    paths
      .filter(path => has(object, path))
      .forEach(path => validateObjectPath(object, path, validatorFactory))
  }

  function validatePlainObjectPaths(object: Object, paths: string[]) {
    const validatorFactory = makeCreateTypeValidator({
      validateFn: isPlainObject,
      messageTypeLabel: 'an object',
    })
    validateObjectPaths(object, paths, validatorFactory)
  }

  function validateStringPaths(object: Object, paths: string[]) {
    const validatorFactory = makeCreateTypeValidator({
      validateFn: isString,
      messageTypeLabel: 'a string',
    })
    validateObjectPaths(object, paths, validatorFactory)
  }

  function validateStringOrPlainObjectPaths(object: Object, paths: string[]) {
    const validatorFactory = makeCreateTypeValidator({
      validateFn: isStringOrPlainObject,
      messageTypeLabel: 'a string or an object',
    })
    validateObjectPaths(object, paths, validatorFactory)
  }

  function validateBooleanPaths(object: Object, paths: string[]) {
    const validatorFactory = makeCreateTypeValidator({
      validateFn: isBoolean,
      messageTypeLabel: 'a boolean',
    })

    validateObjectPaths(object, paths, validatorFactory)
  }

  function validateBooleanOrPlainObjectPaths(object: Object, paths: string[]) {
    const validatorFactory = makeCreateTypeValidator({
      validateFn: isBooleanOrPlainObject,
      messageTypeLabel: 'a boolean or an object',
    })
    validateObjectPaths(object, paths, validatorFactory)
  }

  return {
    validateBooleanPaths,
    validateBooleanOrPlainObjectPaths,
    validateStringPaths,
    validateStringOrPlainObjectPaths,
    validatePlainObjectPaths,
  }
}
