// @flow

import nunjucks from "nunjucks"
import fse from "fs-extra"

import type { IReactComponent } from "./interfaces"
import type { IFile } from "../File/interfaces"
import type { IRenderable } from "../Interfaces/IRenderable"
import writeFile from "../File/write-file"

function getTemplateString(templatePath: string | null): Promise<string> {
  if (!templatePath) {
    return Promise.resolve("")
  }

  return fse.readFile(templatePath, {
    encoding: "utf8"
  })
}

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

    return getTemplateString(file.getTemplatePath())
      .then(compileTemplateString)
      .then(compiledTemplate => {
        return renderCompiledTemplate(compiledTemplate, {
          componentName: component.getName()
        })
      })
      .then(renderedTemplate => {
        return writeFile(file, renderedTemplate).then(path => {
          return {
            [file.getRole()]: path
          }
        })
      })
  })

  return Promise.all(filePromises)
}
