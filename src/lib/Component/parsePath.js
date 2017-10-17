// @flow
import path from "path"
import slashes from "remove-trailing-slash"
import sanitize from "sanitize-filename"

import type { Config } from "../Config/types"

function getComponentName(splitName: Array<string>) {
  return sanitize(splitName[splitName.length - 1])
}

function getComponentRootDir(splitName: Array<string>, config: Config | null) {
  if (!config || config.rules["component-name-root-dir"]) {
    return sanitize(splitName[splitName.length - 1])
  }

  return splitName.length > 1 ? sanitize(splitName[splitName.length - 2]) : ""
}

function getComponentRootDirParents(
  splitName: Array<string>,
  config: Config | null
) {
  if (!config || config.rules["component-name-root-dir"]) {
    return splitName.slice(0, splitName.length - 1).map(dir => sanitize(dir))
  }

  return splitName.slice(0, splitName.length - 2).map(dir => sanitize(dir))
}

function removeFileExtension(componentPath: string) {
  return componentPath.replace(path.extname(componentPath), "")
}

export default function parseComponentPath(
  componentPath: string,
  config: Config | null
): Object {
  const normalized = removeFileExtension(path.normalize(slashes(componentPath)))
  const splitName: Array<string> = normalized.split(path.sep)
  return {
    rootName: getComponentRootDir(splitName, config),
    parentDirs: getComponentRootDirParents(splitName, config),
    componentName: getComponentName(splitName)
  }
}
