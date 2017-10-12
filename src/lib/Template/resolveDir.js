// @flow

import path from "path"
import has from "lodash/has"

import type { Config } from "../Config/types"
import type { IFileSystem } from "../FileSystem/interfaces"

export default (fs: IFileSystem) =>
  function resolveTemplateDir(
    templateName: string,
    defaultDirPath: string,
    config: Config
  ): string {
    // If global config object does NOT have a templates path
    // specified then return the default directory path for
    // that template -- typically contained inside each
    // individual plugin package.
    if (!has(config, "paths.templates")) return defaultDirPath

    const customTemplatesDirPath = config.paths.templates

    return fs.pathExistsSync(path.resolve(customTemplatesDirPath, templateName))
      ? customTemplatesDirPath
      : defaultDirPath
  }
