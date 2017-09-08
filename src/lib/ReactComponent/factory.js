// @flow
import { get } from "lodash"
import EventEmitter from "events"

import type {
  ReactComponentProps,
  ReactComponentFiles,
  ReactComponentFileTemplatePaths
} from "./types"
import type { IReactComponent } from "./interfaces"
import type { Config } from "../Config/types"
import { getFilesTemplatesPaths } from "./utils"
import defaultConfig from "../Config/default"

export default (createComponentFile: Function, emitter: EventEmitter) => (
  props: ReactComponentProps,
  config: Config
): IReactComponent => {
  const templatePaths: ReactComponentFileTemplatePaths = getFilesTemplatesPaths(
    config,
    props
  )

  const files: ReactComponentFiles = {
    mainFile: createComponentFile({
      name: props.name,
      extension: get(
        config,
        "extensions.js.main",
        defaultConfig.extensions.js.main
      ),
      dir: props.path,
      role: "main",
      templatePath: templatePaths.main
    })
  }

  if (props.index) {
    files.indexFile = createComponentFile({
      name: "index",
      extension: get(
        config,
        "extensions.js.index",
        defaultConfig.extensions.js.index
      ),
      dir: props.path,
      role: "index",
      templatePath: templatePaths.index
    })
  }

  if (props.stylesheet) {
    files.stylesheetFile = createComponentFile({
      name: "styles",
      extension: get(
        config,
        "extensions.stylesheet.main",
        defaultConfig.extensions.stylesheet.main
      ),
      dir: props.path,
      role: "stylesheet",
      templatePath: null
    })
  }

  // Public API
  const getName = () => props.name
  const getPath = () => props.path
  const getFiles = () => files
  const getEmitter = () => emitter

  return {
    getName,
    getPath,
    getFiles,
    getEmitter
  }
}
