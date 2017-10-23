// @flow

import EventEmitter from 'events'

import type { Plugin } from './types'
import type { ReactComponentProps } from '../Component/types'
import type { Config } from '../Config/types'
import constants from './constants'
import InvalidPluginError from '../Errors/InvalidPluginError'
import SkipPluginError from '../Errors/SkipPluginError'
import type { FileProps } from '../ComponentFile/types'
import type { IPluginValidator } from './interfaces'

export default (emitter: EventEmitter, pluginValidator: IPluginValidator) =>
  function initPlugins(
    plugins: Plugin[],
    props: ReactComponentProps,
    config: Config
  ): Object[] {
    return plugins.reduce((acc, plugin) => {
      let fileProps: FileProps
      try {
        fileProps = pluginValidator.validate(plugin, plugin.init(props, config))

        if (fileProps.skip) {
          throw new SkipPluginError()
        }

        return [
          ...acc,
          {
            fileProps,
            name: plugin.getName(),
            path: plugin.getPath(),
          },
        ]
      } catch (e) {
        if (e instanceof InvalidPluginError) {
          emitter.emit(
            'error',
            `Cannot initialize plugin ${constants.PLUGIN_PREFIX}-${plugin.getName()}.
           Problem: ${e}
           `
          )
        }
        if (e instanceof SkipPluginError) {
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
