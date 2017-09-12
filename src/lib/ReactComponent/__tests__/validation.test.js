import fs from "fs"
import path from "path"

import {
  validateStatelessFunctionalComponent,
  validateIndexFile,
  validateES6ClassComponent,
  validateJSXText,
  validateJSXIdentifier,
  validateTestsFile
} from "../validation"
import * as constants from "../constants"

const sfComponent = path.resolve(
  __dirname,
  "..",
  "__mocks__",
  constants.SFC_TEMPLATE_FILE_NAME
)

const es6ClassComponent = path.resolve(
  __dirname,
  "..",
  "__mocks__",
  constants.ES6_CLASS_TEMPLATE_FILE_NAME
)

const indexFile = path.resolve(
  __dirname,
  "..",
  "__mocks__",
  constants.INDEX_TEMPLATE_FILE_NAME
)

const testsFile = path.resolve(
  __dirname,
  "..",
  "__mocks__",
  constants.TESTS_FILE_TEMPLATE_FILE_NAME
)

describe("validateStatelessFunctionalComponent", () => {
  it("should validate a correct React Stateless Functional Component file", done => {
    expect.assertions(1)
    fs.readFile(sfComponent, "utf8", (err, data) => {
      expect(validateStatelessFunctionalComponent(data, "TestComponent")).toBe(
        true
      )
      done()
    })
  })
  it("should not validate a React ES6 Class Component file", done => {
    expect.assertions(1)
    fs.readFile(es6ClassComponent, "utf8", (err, data) => {
      expect(validateStatelessFunctionalComponent(data, "TestComponent")).toBe(
        false
      )
      done()
    })
  })
})

describe("validateE6ClassComponent", () => {
  it("should validate a correct React ES6 Class Component file", done => {
    expect.assertions(1)
    fs.readFile(es6ClassComponent, "utf8", (err, data) => {
      expect(validateES6ClassComponent(data, "TestComponent")).toBe(true)
      done()
    })
  })
  it("should not validate a Stateless Functional Component file", done => {
    expect.assertions(1)
    fs.readFile(sfComponent, "utf8", (err, data) => {
      expect(validateES6ClassComponent(data, "TestComponent")).toBe(false)
      done()
    })
  })
})

describe("validateIndexFile", () => {
  it("should validate a correct React Component index file", done => {
    expect.assertions(1)
    fs.readFile(indexFile, "utf8", (err, data) => {
      expect(validateIndexFile(data, "StatelessFunctionalComponent")).toBe(true)
      done()
    })
  })
})

describe("validateTestsFile", () => {
  it("should validate a correct React Component tests file", done => {
    expect.assertions(1)
    fs.readFile(testsFile, "utf8", (err, data) => {
      expect(validateTestsFile(data, "TestComponent")).toBe(true)
      done()
    })
  })
})

xdescribe("validateJSXText", () => {
  it("should validate JSX Text inside a component file", done => {
    expect.assertions(1)
    fs.readFile(sfComponent, "utf8", (err, data) => {
      expect(validateJSXText(data, "TestComponent")).toBe(true)
      done()
    })
  })
})

describe("validateJSXElement", () => {
  it("should validate JSX Element inside a component file", () => {
    expect.assertions(1)
    const JSX = `<div>
    <TestElement/>
      <p>React Component</p>
    </div>`
    expect(validateJSXIdentifier(JSX, "TestElement")).toBe(true)
  })
})
