// @flow

import type { ComponentFile } from "../ComponentFile/types"
import createComponentFile from "../ComponentFile/factory"
import type { Object } from "./types"
import type { Config } from "../Config/types"

export default function mapPluginsToComponentFiles(
  plugins: Array<Object>,
  config: Config
): Array<ComponentFile> {
  return plugins.map(plugin => createComponentFile(plugin.fileProps, config))
}
