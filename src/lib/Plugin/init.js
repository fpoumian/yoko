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
          throw error
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
        emitter.emit(
          'error',
          `Cannot initialize plugin ${constants.PLUGIN_PREFIX}-${plugin.getName()}.
           Problem: ${e}
           `
        )
        return acc
      }
    }, [])
  }
