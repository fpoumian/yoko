// @flow

import * as acorn from "acorn-jsx"
import * as squery from "grasp-squery"

function parseCode(code: string) {
  let parsedCode
  try {
    parsedCode = acorn.parse(code, {
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
  return parsedCode
}

function validateCode(code, selectors: Array<string | boolean>): boolean {
  return selectors.every(selector => {
    if (typeof selector === "string") {
      const results = squery.queryParsed(
        squery.parse(selector),
        parseCode(code)
      )
      return results.length > 0
    }
    return selector
  })
}

// function validateJSXText(code: string, text: string): boolean {
//   return validateCode(code, [`Program JSXElement JSXText[value=${text}]`])
// }

export function validateJSXIdentifier(code: string, name: string): boolean {
  return validateCode(code, [
    `Program JSXElement JSXIdentifier[name="${name}"]`
  ])
}

function validateReactImport(code: string): boolean {
  return validateCode(code, [
    `Program > ImportDeclaration > ImportDefaultSpecifier > Identifier[name="React"]`
  ])
}

function validateComponentImport(code: string, value: string): boolean {
  return validateCode(code, [
    `Program > ImportDeclaration > ImportDefaultSpecifier > Identifier[name=${value}]`
  ])
}

export function validateStatelessFunctionalComponent(
  code: string,
  componentName: string
): boolean {
  return validateCode(code, [
    validateReactImport(code),
    `program > FunctionDeclaration > ident#${componentName}`,
    `program > ExportDefaultDeclaration > ident#${componentName}`
  ])
}

export function validateES6ClassComponent(
  code: string,
  componentName: string
): boolean {
  return validateCode(code, [
    validateReactImport(code),
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

export function validateTestsFile(
  code: string,
  componentName: string
): boolean {
  return validateCode(code, [
    validateReactImport(code),
    validateComponentImport(code, componentName),
    `Program > ImportDeclaration > Literal[value="enzyme"]`
  ])
}
