import Joi from 'joi'
import isFunction from 'lodash/isFunction'

import type { Plugin } from './types'
import type { FileProps } from '../ComponentFile/types'
import InvalidPluginError from '../errors/InvalidPluginError'

const schema = Joi.object().keys({
  name: Joi.string().required(),
  extension: Joi.string().required(),
  dir: Joi.string().required(),
  role: Joi.string().required(),
  skip: Joi.boolean(),
  template: Joi.object().keys({
    dir: Joi.string().required(),
    name: Joi.string().required(),
    context: Joi.object(),
  }),
})

export default function validateFilePlugin(
  plugin: Plugin,
  fileProps: FileProps
): FileProps {
  if (!isFunction(plugin.init)) {
    throw new InvalidPluginError(
      `Plugin ${plugin.getName()} does not export a function.`
    )
  }

  const { error, value } = Joi.validate(fileProps, schema)

  if (error) {
    throw new InvalidPluginError(error)
  }

  return value
}
