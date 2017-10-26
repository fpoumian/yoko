// @flow

import type { Plugin, ValidatePluginFn } from './types'
import type { ComponentProps } from '../component/types'
import type { Config } from '../config/types'
import type { FileProps } from '../component-file/types'
import type { IEventEmitter } from '../common/interfaces'

import InvalidPluginError from '../errors/InvalidPluginError'
import SkipPluginError from '../errors/SkipPluginError'

export default (validatePluginFn: ValidatePluginFn) => (
  emitter: IEventEmitter
) =>
  function initPlugins(
    plugins: Plugin[],
    props: ComponentProps,
    config: Config
  ): Object[] {
    return plugins.reduce((acc, plugin) => {
      let fileProps: FileProps
      try {
        fileProps = validatePluginFn(plugin, plugin.init(props, config))

        if (fileProps.skip) {
          throw new SkipPluginError()
        }

        return [...acc, fileProps]
      } catch (e) {
        if (e instanceof InvalidPluginError) {
          emitter.emit(
            'error',
            `Cannot initialize plugin ${plugin.prefixedName()}.
           Problem: ${e}
           `
          )
        }
        if (e instanceof SkipPluginError) {
          emitter.emit(
            'warn',
            `The value of the skip property in the plugin ${plugin.prefixedName()} is set to true, 
             therefore the file assigned to this plugin will not be created.
           `
          )
        }
        return acc
      }
    }, [])
  }
