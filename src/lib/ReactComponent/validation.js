// @flow

import { parse } from "babylon"
import traverse from "babel-traverse"

import UnparsableTypeError from "../Errors/UnparsableTypeError"

// TODO: Refactor validation methods (DRY)

export function validateMainFile(code: string, componentName: string): boolean {
  let ast
  try {
    ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx"]
    })
  } catch (e) {
    if (e instanceof TypeError) {
      throw new UnparsableTypeError(
        `Type ${typeof componentName} cannot be parsed.`
      )
    }
  }

  let isValid = false

  try {
    traverse(ast, {
      enter(path) {
        if (path.type === "ExportDefaultDeclaration") {
          isValid = path.node.declaration.name === componentName
        }
      }
    })
  } catch (e) {
    console.error(e)
    throw e
  }
  return isValid
}

export function validateIndexFile(
  code: string,
  componentFileName: string
): boolean {
  let ast
  try {
    ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx"]
    })
  } catch (e) {
    if (e instanceof TypeError) {
      throw new UnparsableTypeError(
        `Type ${typeof componentFileName} cannot be parsed.`
      )
    }
    throw e
  }

  let isValid = false

  try {
    traverse(ast, {
      enter(path) {
        if (path.type === "ExportSpecifier") {
          isValid = path.node.exported.name === "default"
        }
        if (path.type === "StringLiteral") {
          isValid = path.node.value === `./${componentFileName}`
        }
      }
    })
  } catch (e) {
    console.error(e)
    throw e
  }
  return isValid
}
