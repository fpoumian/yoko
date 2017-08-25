// @flow
import type { ReactComponentProps } from "./types"
import type { IReactComponent } from "./interfaces"
import createComponentFile from "../ComponentFile/factory"
import mainTemplateString from "./templates/mainFile"
import indexTemplateString from "./templates/indexFile"
import type { Config } from "../Config/types"

export default function(
  props: ReactComponentProps,
  config: Config
): IReactComponent {
  const files = {
    mainFile: createComponentFile({
      name: props.name,
      extension: config.extensions.js.main,
      dir: props.path,
      role: "main",
      templateString: mainTemplateString
    }),
    indexFile: createComponentFile({
      name: "index",
      extension: config.extensions.js.index,
      dir: props.path,
      role: "index",
      templateString: indexTemplateString
    }),
    stylesheetFile: createComponentFile({
      name: "styles",
      extension: config.extensions.stylesheet.main,
      role: "stylesheet",
      dir: props.path,
      templateString: ""
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
