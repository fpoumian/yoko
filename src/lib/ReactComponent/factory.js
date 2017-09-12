// @flow
import { get } from "lodash"
import path from "path"
import EventEmitter from "events"

import type {
  ReactComponentProps,
  ReactComponentFileTemplatePaths
} from "./types"
import type { IReactComponent } from "./interfaces"
import type { Config } from "../Config/types"
import { getFilesTemplatesPaths } from "./utils"
import defaultConfig from "../Config/default"
import createFileList from "../FileList/factory"
import type { IFile } from "../File/interfaces"

export default (createComponentFile: Function, emitter: EventEmitter) => (
  props: ReactComponentProps,
  config: Config
): IReactComponent => {
  const templatePaths: ReactComponentFileTemplatePaths = getFilesTemplatesPaths(
    config,
    props
  )

  const files: Map<string, IFile> = createFileList()
  files.set(
    "main",
    createComponentFile({
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
  )

  if (props.index) {
    files.set(
      "index",
      createComponentFile({
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
    )
  }

  if (props.stylesheet) {
    files.set(
      "stylesheet",
      createComponentFile({
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
    )
  }

  if (props.tests) {
    files.set(
      "tests",
      createComponentFile({
        name: `${props.name}.test`,
        extension: get(
          config,
          "extensions.js.tests",
          defaultConfig.extensions.js.tests
        ),
        dir: path.resolve(props.path, "__tests__"),
        role: "tests",
        templatePath: templatePaths.tests
      })
    )
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
