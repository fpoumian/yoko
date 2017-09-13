// @flow
import path from "path"
import fs from "fs"
import { get, keys } from "lodash"
import slashes from "remove-trailing-slash"
import sanitize from "sanitize-filename"

import type { IReactComponent } from "./interfaces"
import type { Config } from "../Config/types"
import type {
  ReactComponentFileTemplatePaths,
  ReactComponentProps
} from "./types"
import * as constants from "./constants"

export function reduceComponentPaths(
  component: IReactComponent,
  paths: Array<Object>
) {
  return paths.reduce(
    (newPaths: Object, pathObj: Object) => ({
      ...newPaths,
      ...pathObj
    }),
    {
      root: component.getPath()
    }
  )
}

export function getFilesTemplatesPaths(
  config: Config,
  options: ReactComponentProps
): ReactComponentFileTemplatePaths {
  const defaultTemplatesDirPath = path.resolve(__dirname, "templates")
  const customTemplatesDirPath = get(config, "paths.templates", "")

  const mainTemplateFileName =
    options.type === "es6class"
      ? constants.ES6_CLASS_TEMPLATE_FILE_NAME
      : constants.SFC_TEMPLATE_FILE_NAME

  const fileNames = {
    main: mainTemplateFileName,
    index: constants.INDEX_TEMPLATE_FILE_NAME,
    tests: constants.TESTS_FILE_TEMPLATE_FILE_NAME
  }

  const defaultPaths = {
    main: path.resolve(defaultTemplatesDirPath, mainTemplateFileName),
    index: path.resolve(
      defaultTemplatesDirPath,
      constants.INDEX_TEMPLATE_FILE_NAME
    ),
    tests: path.resolve(
      defaultTemplatesDirPath,
      constants.TESTS_FILE_TEMPLATE_FILE_NAME
    )
  }

  if (!customTemplatesDirPath) {
    return defaultPaths
  }

  return keys(fileNames).reduce((newPaths, key) => {
    const temp = {
      [key]: fs.existsSync(path.resolve(customTemplatesDirPath, fileNames[key]))
        ? path.resolve(customTemplatesDirPath, fileNames[key])
        : path.resolve(defaultTemplatesDirPath, fileNames[key])
    }

    return { ...temp, ...newPaths }
  }, {})
}

export function getComponentNameInfo(value: string): Object {
  const normalized = slashes(path.normalize(value))
  const splitName: Array<string> = normalized.split(path.sep)
  return {
    rootName: sanitize(splitName[splitName.length - 1]),
    parentDirs: splitName
      .slice(0, splitName.length - 1)
      .map(dir => sanitize(dir))
  }
}
