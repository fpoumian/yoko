// @flow

import path from "path"
import has from "lodash/has"

import type { Config } from "../Config/types"

export default (resolverFn: string => boolean) =>
  function resolveTemplateDir(
    templateName: string,
    defaultDirPath: string,
    config: Config
  ): string {
    // If global config object does NOT have a templates path
    // specified then return the default directory path for
    // that template.
    if (!has(config, "paths.templates")) return defaultDirPath

    const customTemplatesDirPath = config.paths.templates

    const fileExists = resolverFn(
      path.resolve(customTemplatesDirPath, templateName)
    )
    return fileExists ? customTemplatesDirPath : defaultDirPath
  }
