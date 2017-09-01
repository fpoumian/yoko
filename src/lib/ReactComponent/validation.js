// @flow

import * as acorn from "acorn-jsx"
import * as squery from "grasp-squery"

function parseCode(code: string) {
  try {
    return acorn.parse(code, {
      sourceType: "module",
      plugins: {
        jsx: true
      }
    })
  } catch (e) {
    if (e instanceof TypeError) {
      throw e
    }
  }
}

function validateCode(code, selectors: Array<string>): boolean {
  return selectors.every(selector => {
    const results = squery.queryParsed(squery.parse(selector), parseCode(code))
    return results.length > 0
  })
}

export function validateStatelessFunctionalComponent(
  code: string,
  componentName: string
): boolean {
  return validateCode(code, [
    `program > FunctionDeclaration > ident#${componentName}`,
    `program > ExportDefaultDeclaration > ident#${componentName}`
  ])
}

export function validateES6ClassComponent(
  code: string,
  componentName: string
): boolean {
  return validateCode(code, [
    `program > ClassDeclaration > ident#${componentName}`,
    `program > ExportDefaultDeclaration > ident#${componentName}`
  ])
}

export function validateIndexFile(
  code: string,
  componentName: string
): boolean {
  return validateCode(code, [
    `Program > ExportNamedDeclaration > Literal[value="./${componentName}"]`,
    `Program > ExportNamedDeclaration > ExportSpecifier > Identifier[name="default"]`
  ])
}

export function validateJSXText(code: string, text: string): boolean {
  return validateCode(code, [`Program JSXElement JSXText[value=${text}]`])
}

export function validateJSXIdentifier(code: string, name: string): boolean {
  return validateCode(code, [
    `Program JSXElement JSXIdentifier[name="${name}"]`
  ])
}
