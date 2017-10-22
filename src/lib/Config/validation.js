// @flow
import type { Config } from './types'
import Joi from 'joi'
import BadConfigError from '../Errors/BadConfigError'

const schema = Joi.object().keys({
  paths: Joi.object().keys({
    components: Joi.string(),
    containers: Joi.string(),
    templates: Joi.string(),
  }),
  extensions: Joi.object().keys({
    js: Joi.object().keys({
      main: Joi.string(),
      index: Joi.string(),
      tests: Joi.string(),
    }),
    stylesheet: Joi.object().keys({
      main: Joi.string(),
    }),
  }),
  rules: Joi.object({}).pattern(/.*/, Joi.boolean()),
  plugins: Joi.array().items(Joi.string()),
  formatting: Joi.object().keys({
    prettier: [Joi.boolean(), Joi.object()],
  }),
})

export default function(config: Config): Config {
  const { error, value } = Joi.validate(config, schema)
  if (error) {
    throw new BadConfigError(error.details[0].message)
  }
  return value
}
