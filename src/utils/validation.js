// @flow

import { parse } from "babylon"
import traverse from "babel-traverse"

import UnparsableTypeError from "../lib/Errors/UnparsableTypeError"

export function validateMainFile(
  code: string,
  componentName: string
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
