// @flow

import type { Plugin } from './types'
import type { ComponentProps } from '../Component/types'
import type { Config } from '../Config/types'
import type { FileProps } from '../ComponentFile/types'
import type { IPluginValidator } from './interfaces'
import type { IEventEmitter } from '../EventEmitter/interfaces'

import InvalidPluginError from '../Errors/InvalidPluginError'
import SkipPluginError from '../Errors/SkipPluginError'

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
