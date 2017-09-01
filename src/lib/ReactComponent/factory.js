// @flow
import path from "path"

import type {
  ReactComponentProps,
  ReactComponentFiles,
  ReactComponentFileTemplatePaths
} from "./types"
import type { IReactComponent } from "./interfaces"
import createComponentFile from "../ComponentFile/factory"
import type { Config } from "../Config/types"
import { getFilesTemplatesPaths } from "./utils"

export default function(
  props: ReactComponentProps,
  config: Config
): IReactComponent {
  const templatePaths: ReactComponentFileTemplatePaths = getFilesTemplatesPaths(
    config,
    props
  )

  const files: ReactComponentFiles = {
    mainFile: createComponentFile({
      name: props.name,
      extension: config.extensions.js.main,
      dir: props.path,
      role: "main",
      templatePath: templatePaths.main
    })
  }

  if (props.index) {
    files.indexFile = createComponentFile({
      name: "index",
      extension: config.extensions.js.index,
      dir: props.path,
      role: "index",
      templatePath: templatePaths.index
    })
  }

  if (props.stylesheet) {
    files.stylesheetFile = createComponentFile({
      name: "styles",
      extension: config.extensions.stylesheet.main,
      dir: props.path,
      role: "stylesheet",
      templatePath: null
    })
  }

  // Public API
  const getName = () => props.name
  const getPath = () => props.path
  const getFiles = () => files

  return {
    getName,
    getPath,
    getFiles
  }
}
