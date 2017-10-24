// @flow
import type { ComponentFile, FileProps } from '../ComponentFile/types'
import createComponentFile from '../ComponentFile/factory'
import type { Config } from '../Config/types'

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
