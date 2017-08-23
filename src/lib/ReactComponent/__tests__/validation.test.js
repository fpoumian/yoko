import fs from "fs"
import path from "path"

import { validateMainFile, validateIndexFile } from "../validation"
import UnparsableTypeError from "../../Errors/UnparsableTypeError"

describe("validateMainFile", () => {
  it("should validate a correct React Component main file", done => {
    expect.assertions(1)
    fs.readFile(
      path.resolve(__dirname, "..", "__mocks__", "MainComponentFile.js"),
      "utf8",
      (err, data) => {
        expect(validateMainFile(data, "TestComponent")).toBe(true)
        done()
      }
    )
  })

  it("should detect an empty string and throw an error", done => {
    expect.assertions(1)
    fs.readFile("", "utf8", (err, data) => {
      expect(() => {
        validateMainFile(data, "ReactComponent")
      }).toThrowError(UnparsableTypeError)
      done()
    })
  })

  it("should detect an empty string and throw an error", done => {
    expect(() => {
      validateMainFile(undefined, "ReactComponent")
    }).toThrowError(UnparsableTypeError)
    done()
  })
})

describe("validateIndexFile", () => {
  it("should validate a correct React Component index file", done => {
    expect.assertions(1)
    fs.readFile(
      path.join(__dirname, "..", "__mocks__", "index.js"),
      "utf8",
      (err, data) => {
        expect(validateIndexFile(data, "MainComponentFile")).toBe(true)
        done()
      }
    )
  })
})
