// @flow
import type { ComponentFile, FileProps } from '../component-file/types'
import createComponentFile from '../component-file/factory'
import type { Config } from '../config/types'

export default (resolveComponentFileTemplate: Function) =>
  function mapPluginsDataToComponentFiles(
    pluginsData: FileProps[],
    config: Config
  ): ComponentFile[] {
    return pluginsData.map((fileProps: Object) => {
      const newFileProps: FileProps = Object.assign({}, fileProps, {
        template: resolveComponentFileTemplate(config, fileProps),
      })
      return createComponentFile(newFileProps)
    })
  }
