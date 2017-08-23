// @flow

import nunjucks from "nunjucks"

import type { IReactComponent } from "./interfaces"
import type { IFile } from "../File/interfaces"
import type { IRenderable } from "../Interfaces/IRenderable"
import writeFile from "../File/write-file"

function compileTemplateString(templateString: string): IRenderable {
  return nunjucks.compile(templateString)
}

function renderCompiledTemplate(
  compiledTemplate: IRenderable,
  context: Object
): string {
  return compiledTemplate.render(context)
}

export default function(component: IReactComponent): Promise<any> {
  const componentFiles: { [string]: IFile } = component.getFiles()

  const filePromises: Array<Promise<any>> = Object.keys(
    componentFiles
  ).map(fileKey => {
    const file: IFile = componentFiles[fileKey]

    const compiledTemplate: IRenderable = compileTemplateString(
      file.getTemplateString()
    )

    const renderedTemplate = renderCompiledTemplate(compiledTemplate, {
      componentName: component.getName()
    })

    return writeFile(file, renderedTemplate).then(path => {
      return {
        [file.getRole()]: path
      }
    })
  })

  return Promise.all(filePromises)
}
