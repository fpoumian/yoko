// @flow

import type { Plugin } from './types'
import type { ComponentProps } from '../component/types'
import type { Config } from '../config/types'
import type { FileProps } from '../ComponentFile/types'
import type { IPluginValidator } from './interfaces'
import type { IEventEmitter } from '../common/interfaces'

import InvalidPluginError from '../errors/InvalidPluginError'
import SkipPluginError from '../errors/SkipPluginError'

export default (emitter: IEventEmitter, pluginValidator: IPluginValidator) =>
  function initPlugins(
    plugins: Plugin[],
    props: ComponentProps,
    config: Config
  ): Object[] {
    return plugins.reduce((acc, plugin) => {
      let fileProps: FileProps
      try {
        fileProps = pluginValidator.validate(plugin, plugin.init(props, config))

        if (fileProps.skip) {
          throw new SkipPluginError()
        }

        return [...acc, fileProps]
      } catch (e) {
        if (e instanceof InvalidPluginError) {
          emitter.emit(
            'error',
            `Cannot initialize plugin ${plugin.getPrefixedName()}.
           Problem: ${e}
           `
          )
        }
        if (e instanceof SkipPluginError) {
          emitter.emit(
            'warn',
            `The value of the skip property in the plugin ${plugin.getPrefixedName()} is set to true, 
             therefore the file assigned to this plugin will not be created.
           `
          )
        }
        return acc
      }
    }, [])
  }
