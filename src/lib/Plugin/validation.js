// @flow
import { isFunction, has, isString } from "lodash"

import type { Plugin } from "./types"
import type { FileProps } from "../ComponentFile/types"
import type { ReactComponentProps } from "../ReactComponent/types"
import type { Config } from "../Config/types"

export default function validateFilePlugin(
  plugin: Plugin,
  componentProps: ReactComponentProps,
  config: Config
): FileProps {
  if (!isFunction(plugin.init)) {
    throw new TypeError(
      `Plugin ${plugin.getName()} does not export a function.`
    )
  }
  const fileProps: FileProps = plugin.init(componentProps, config)
  const requiredProps = ["name", "extension", "dir", "role"]
  requiredProps.forEach(prop => {
    if (!has(fileProps, prop)) {
      throw new Error(
        `Object returned from plugin ${plugin.getName()} is missing required property ${prop}.`
      )
    }
    if (!isString(fileProps[prop])) {
      throw new TypeError(
        `Property ${prop} of plugin ${plugin.getName()} is not a string.`
      )
    }

    if (fileProps[prop].trim() === "") {
      throw new Error(
        `Property ${prop} of plugin ${plugin.getName()} cannot be an empty string.`
      )
    }
  })
  return fileProps
}
