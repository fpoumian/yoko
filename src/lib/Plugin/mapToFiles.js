// @flow
import type { ComponentFile, FileProps } from "../ComponentFile/types"
import createComponentFile from "../ComponentFile/factory"
import makeResolveComponentFileTemplate from "../ComponentFile/resolveTemplate"
import type { Config } from "../Config/types"
import type { IFileSystem } from "../FileSystem/interfaces"

export default (fs: IFileSystem) =>
  function mapPluginsDataToComponentFiles(
    pluginsData: Array<Object>,
    config: Config
  ): Array<ComponentFile> {
    const resolveComponentFileTemplate = makeResolveComponentFileTemplate(fs)
    return pluginsData.map(pluginData => {
      const fileProps: FileProps = {
        ...pluginData.fileProps,
        template: resolveComponentFileTemplate(config, pluginData.fileProps)
      }

      return createComponentFile(fileProps)
    })
  }
