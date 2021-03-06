// @flow
import path from 'path'
import has from 'lodash/has'

import type { IFileSystem } from '../common/interfaces'
import type { FileProps } from './types'

export default (fs: IFileSystem) =>
  function resolveFileTemplate(
    config: Object,
    fileProps: FileProps
  ): Object | null {
    if (!fileProps.template) return null
    const { name, context } = fileProps.template

    // If global config object does NOT have a templates path specified
    // then return the default template object from plugin.
    if (!has(config, 'paths.templates') || config.paths.templates.trim() === '')
      return fileProps.template

    return fs.pathExistsSync(path.resolve(config.paths.templates, name))
      ? {
          name,
          dir: config.paths.templates,
          context,
        }
      : fileProps.template
  }
