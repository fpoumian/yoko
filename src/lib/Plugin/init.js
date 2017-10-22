// @flow

import EventEmitter from 'events'
import Joi from 'joi'
import isFunction from 'lodash/isFunction'

import type { Plugin } from './types'
import type { ReactComponentProps } from '../Component/types'
import type { Config } from '../Config/types'
import constants from './constants'

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

export default (emitter: EventEmitter) =>
  function initPlugins(
    plugins: Plugin[],
    props: ReactComponentProps,
    config: Config
  ): Object[] {
    return plugins.reduce((acc, plugin) => {
      try {
        if (!isFunction(plugin.init)) {
          throw new TypeError(
            `Plugin ${plugin.getName()} does not export a function.`
          )
        }
        const { error, value } = Joi.validate(
          plugin.init(props, config),
          schema
        )
        if (error) {
          throw new TypeError(error)
        }

        if (value.skip) {
          throw new Error()
        }

        return [
          ...acc,
          {
            fileProps: value,
            name: plugin.getName(),
            path: plugin.getPath(),
          },
        ]
      } catch (e) {
        if (e instanceof TypeError) {
          emitter.emit(
            'error',
            `Cannot initialize plugin ${constants.PLUGIN_PREFIX}-${plugin.getName()}.
           Problem: ${e}
           `
          )
        }
        if (e instanceof Error) {
          emitter.emit(
            'warn',
            `The value of the skip property in the plugin ${constants.PLUGIN_PREFIX}-${plugin.getName()} is set to true, 
             therefore the file assigned to this plugin will not be created.
           `
          )
        }
        return acc
      }
    }, [])
  }
