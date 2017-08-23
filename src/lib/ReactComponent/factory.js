// @flow
import type { ReactComponentProps } from "./types"
import type { IReactComponent } from "./interfaces"
import createComponentFile from "../ComponentFile/factory"
import mainTemplateString from "./templates/mainFile"
import indexTemplateString from "./templates/indexFile"

export default function(
  props: ReactComponentProps,
  home: string
): IReactComponent {
  const files = {
    mainFile: createComponentFile({
      name: props.name,
      extension: "js",
      dir: props.path,
      role: "main",
      templateString: mainTemplateString
    }),
    indexFile: createComponentFile({
      name: "index",
      extension: "js",
      dir: props.path,
      role: "index",
      templateString: indexTemplateString
    }),
    stylesheetFile: createComponentFile({
      name: "styles",
      extension: "css",
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
