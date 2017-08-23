// @flow
import type { ReactComponentProps } from "./types"
import type { IReactComponent } from "./interfaces"

import path from "path"
import createComponentFile from "../ComponentFile/factory"

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
      templateString: `
import React from 'react'

/** {{ componentName }} */
function {{ componentName }}() {
  return (
    <div>{{ componentName }}</div>
  )
}
export default {{ componentName }}
`
    }),
    indexFile: createComponentFile({
      name: "index",
      extension: "js",
      dir: props.path,
      role: "index",
      templateString: `
      export { default } from "./{{ componentName }}"
      
      `
    }),
    stylesheetFile: createComponentFile({
      name: "styles",
      extension: "css",
      role: "stylesheet",
      dir: props.path,
      templateString: ""
    })
  }

  const getName = () => props.name
  const getPath = () => props.path
  const getFiles = () => files

  return {
    getName,
    getPath,
    getFiles
  }
}
