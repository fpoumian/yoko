// @flow

import mock from "mock-fs"
import fs from "fs"
import path from "path"

import reactCG from "../src"
import {
  validateMainFile,
  validateIndexFile
} from "../src/lib/ReactComponent/validation"

function getDirContents(path: string) {
  return fs.readdirSync(path)
}

function mockFileSystem() {
  mock({
    src: {
      components: {}
    }
  })
}

describe("generate", () => {
  let srcDir
  let componentsDir
  let getComponentsDirContents
  let resolveInComponents

  const config = {
    paths: {
      components: "/src/components",
      containers: "/src/containers"
    },
    extension: "js"
  }

  const rcg = reactCG(config)

  beforeEach(() => {
    mockFileSystem()
    srcDir = path.resolve(process.cwd(), "src")
    componentsDir = path.resolve(srcDir, "components")
    getComponentsDirContents = () => getDirContents(componentsDir)
    resolveInComponents = (...items) => path.resolve(componentsDir, ...items)
  })

  it("should create one directory inside of components Home directory", () => {
    expect.assertions(1)
    return rcg.generate("TestComponent").then(componentPaths => {
      expect(resolveInComponents("TestComponent")).toEqual(componentPaths.root)
    })
  })

  it("should create five directories inside of components Home directory", () => {
    expect.assertions(1)

    const promises = [
      rcg.generate("ComponentOne"),
      rcg.generate("ComponentTwo"),
      rcg.generate("ComponentThree"),
      rcg.generate("ComponentFour"),
      rcg.generate("ComponentFive")
    ]

    return Promise.all(promises).then(() => {
      expect(getComponentsDirContents()).toHaveLength(5)
    })
  })

  it("should create components directories with a recursive path", () => {
    expect.assertions(1)
    return expect(
      rcg.generate("ParentDirectory/TestComponent")
    ).resolves.toHaveProperty(
      "root",
      resolveInComponents("ParentDirectory", "TestComponent")
    )
  })

  it("should create component inside existing directory if it already exists", () => {
    expect.assertions(1)

    const promises = [
      rcg.generate("ParentDirectory/ComponentOne"),
      rcg.generate("ParentDirectory/ComponentTwo")
    ]

    return Promise.all(promises).then(() => {
      expect(
        getDirContents(resolveInComponents("ParentDirectory"))
      ).toHaveLength(2)
    })
  })

  it("should create a main JS file for the component", () => {
    expect.assertions(1)
    return rcg.generate("TestComponent").then(paths => {
      expect(getDirContents(paths.root)).toContain("TestComponent.js")
    })
  })

  it("should create main JS files for multiple components inside existing directories", () => {
    expect.assertions(2)

    const promises = [
      rcg.generate("ParentDirectory/ComponentOne"),
      rcg.generate("ParentDirectory/ComponentTwo")
    ]

    return Promise.all(promises).then(() => {
      expect(
        getDirContents(resolveInComponents("ParentDirectory", "ComponentOne"))
      ).toContain("ComponentOne.js")
      expect(
        getDirContents(resolveInComponents("ParentDirectory", "ComponentTwo"))
      ).toContain("ComponentTwo.js")
    })
  })

  it("should create a valid React Component", () => {
    expect.assertions(1)
    return rcg.generate("TestComponent").then(paths => {
      const testComponent: string = fs.readFileSync(path.resolve(paths.main), {
        encoding: "utf8"
      })
      expect(validateMainFile(testComponent, "TestComponent")).toBe(true)
    })
  })

  it("should create a valid React Component within parent directory", () => {
    expect.assertions(1)
    return rcg.generate("ParentDirectory/TestComponent").then(paths => {
      const testComponent: string = fs.readFileSync(path.resolve(paths.main), {
        encoding: "utf8"
      })
      expect(validateMainFile(testComponent, "TestComponent")).toBe(true)
    })
  })

  it("should create a index JS file for the component", () => {
    expect.assertions(1)
    return rcg.generate("TestComponent").then(paths => {
      expect(getDirContents(paths.root)).toContain("index.js")
    })
  })

  it("should create index.js files for multiple components inside existing directories", () => {
    expect.assertions(2)

    const promises = [
      rcg.generate("ParentDirectory/ComponentOne"),
      rcg.generate("ParentDirectory/ComponentTwo")
    ]

    return Promise.all(promises).then(() => {
      expect(
        getDirContents(resolveInComponents("ParentDirectory", "ComponentOne"))
      ).toContain("index.js")
      expect(
        getDirContents(resolveInComponents("ParentDirectory", "ComponentTwo"))
      ).toContain("index.js")
    })
  })

  it("should create a valid index.js file", () => {
    expect.assertions(1)
    return rcg.generate("TestComponent").then(paths => {
      const indexFile: string = fs.readFileSync(path.resolve(paths.index), {
        encoding: "utf8"
      })
      expect(validateIndexFile(indexFile, "TestComponent")).toBe(true)
    })
  })

  it("should create a stylesheet file for the component", () => {
    expect.assertions(1)
    return rcg.generate("TestComponent").then(paths => {
      expect(getDirContents(paths.root)).toContain("styles.css")
    })
  })

  it("should create an empty stylesheet file", () => {
    expect.assertions(1)
    return rcg.generate("TestComponent").then(paths => {
      const stylesheet: string = fs.readFileSync(
        path.resolve(paths.stylesheet),
        {
          encoding: "utf8"
        }
      )
      expect(stylesheet.trim()).toBe("")
    })
  })

  afterEach(() => {
    mock.restore()
  })
})
