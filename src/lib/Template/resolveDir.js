// @flow

import path from "path"
import { has } from "lodash"

import type { Config } from "../Config/types"

export default (resolverFn: string => boolean) =>
  function resolveTemplateDir(
    templateName: string,
    defaultDir: string,
    config: Config
  ): string {
    if (!has(config, "paths.templates")) return defaultDir

    const customTemplatesDir = config.paths.templates

    const fileExists = resolverFn(
      path.resolve(customTemplatesDir, templateName)
    )
    return fileExists ? customTemplatesDir : defaultDir
  }
