// @flow

import mock from "mock-fs"
import fs from "fs"
import path from "path"

import reactCG from "../src"
import {
  validateStatelessFunctionalComponent,
  validateIndexFile,
  validateES6ClassComponent,
  validateJSXIdentifier
} from "../src/lib/ReactComponent/validation"
import index from "../src/index"
import * as constants from "../src/lib/ReactComponent/constants"

function getDirContents(path: string) {
  return fs.readdirSync(path)
}

const defaultTemplatesDirRelativePath = "../src/lib/ReactComponent/templates/"
const mockDefaultTemplatePaths = {
  lib: {
    ReactComponent: {
      templates: {
        [constants.SFC_TEMPLATE_FILE_NAME]: require(defaultTemplatesDirRelativePath +
          constants.SFC_TEMPLATE_FILE_NAME).default,
        [constants.ES6_CLASS_TEMPLATE_FILE_NAME]: require(defaultTemplatesDirRelativePath +
          constants.ES6_CLASS_TEMPLATE_FILE_NAME).default,
        [constants.INDEX_TEMPLATE_FILE_NAME]: require(defaultTemplatesDirRelativePath +
          constants.INDEX_TEMPLATE_FILE_NAME).default
      }
    }
  }
}

const mockCustomTemplates = {
  customJSX: require("../src/lib/ReactComponent/templates/mainFileCustomJSX.js")
    .default
}

function mockFileSystem() {
  mock({
    src: {
      ...mockDefaultTemplatePaths
    }
  })
}

describe("generate", () => {
  let srcDir
  let componentsDir
  let containersDir
  let getComponentsDirContents
  let resolveInComponents
  let resolveInContainers

  beforeEach(() => {
    mockFileSystem()
    getComponentsDirContents = () => getDirContents(componentsDir)
    resolveInComponents = (...items) => path.resolve(componentsDir, ...items)
    resolveInContainers = (...items) => path.resolve(containersDir, ...items)
  })

  describe("given a global configuration with custom paths for components and containers", () => {
    beforeEach(() => {
      srcDir = path.resolve(process.cwd(), "src")
      componentsDir = path.resolve(srcDir, "components")
      containersDir = path.resolve(srcDir, "containers")
    })

    const config = {
      paths: {
        components: "./src/components",
        containers: "./src/containers"
      }
    }

    const rcg = reactCG(config)

    describe("given no aditional component options were provided", () => {
      it("should create one directory inside of components Home directory", () => {
        expect.assertions(1)
        return rcg.generate("TestComponent").then(paths => {
          expect(resolveInComponents("TestComponent")).toEqual(paths.root)
        })
      })

      it("should return a path object with only root and main properties", () => {
        expect.assertions(1)
        return rcg.generate("TestComponent").then(paths => {
          expect(paths).toEqual({
            root: resolveInComponents("TestComponent"),
            main: resolveInComponents("TestComponent", "TestComponent.js")
          })
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
            getDirContents(
              resolveInComponents("ParentDirectory", "ComponentOne")
            )
          ).toContain("ComponentOne.js")
          expect(
            getDirContents(
              resolveInComponents("ParentDirectory", "ComponentTwo")
            )
          ).toContain("ComponentTwo.js")
        })
      })

      it("should create a valid React Component using the default Stateless Functional Component template", () => {
        expect.assertions(1)
        return rcg.generate("TestComponent").then(paths => {
          const testComponent: string = fs.readFileSync(
            path.resolve(paths.main),
            {
              encoding: "utf8"
            }
          )
          expect(
            validateStatelessFunctionalComponent(testComponent, "TestComponent")
          ).toBe(true)
        })
      })

      it("should create a valid React Component within parent directory", () => {
        expect.assertions(1)
        return rcg.generate("ParentDirectory/TestComponent").then(paths => {
          const testComponent: string = fs.readFileSync(
            path.resolve(paths.main),
            {
              encoding: "utf8"
            }
          )
          expect(
            validateStatelessFunctionalComponent(testComponent, "TestComponent")
          ).toBe(true)
        })
      })
    })

    describe("given that the index option is set to true", () => {
      it("should return a path object with root, index and main properties", () => {
        expect.assertions(1)
        return rcg
          .generate("TestComponent", {
            index: true
          })
          .then(paths => {
            expect(paths).toEqual({
              root: resolveInComponents("TestComponent"),
              main: resolveInComponents("TestComponent", "TestComponent.js"),
              index: resolveInComponents("TestComponent", "index.js")
            })
          })
      })

      it("should create a index JS file for the component", () => {
        expect.assertions(1)
        return rcg.generate("TestComponent", { index: true }).then(paths => {
          expect(getDirContents(paths.root)).toContain("index.js")
        })
      })

      it("should create index.js files for first two components, but not the third one", () => {
        expect.assertions(3)

        const promises = [
          rcg.generate("ParentDirectory/ComponentOne", { index: true }),
          rcg.generate("ParentDirectory/ComponentTwo", { index: true }),
          rcg.generate("ParentDirectory/ComponentThree")
        ]

        return Promise.all(promises).then(() => {
          expect(
            getDirContents(
              resolveInComponents("ParentDirectory", "ComponentOne")
            )
          ).toContain("index.js")
          expect(
            getDirContents(
              resolveInComponents("ParentDirectory", "ComponentTwo")
            )
          ).toContain("index.js")
          expect(
            getDirContents(
              resolveInComponents("ParentDirectory", "ComponentThree")
            )
          ).not.toContain("index.js")
        })
      })

      it("should create a valid index.js file", () => {
        expect.assertions(1)
        return rcg.generate("TestComponent", { index: true }).then(paths => {
          const indexFile: string = fs.readFileSync(path.resolve(paths.index), {
            encoding: "utf8"
          })
          expect(validateIndexFile(indexFile, "TestComponent")).toBe(true)
        })
      })
    })

    describe("given that the stylesheet option is set to true", () => {
      it("should return a path object with root, stylesheet and main properties", () => {
        expect.assertions(1)
        return rcg
          .generate("TestComponent", {
            stylesheet: true
          })
          .then(paths => {
            expect(paths).toEqual({
              root: resolveInComponents("TestComponent"),
              main: resolveInComponents("TestComponent", "TestComponent.js"),
              stylesheet: resolveInComponents("TestComponent", "styles.css")
            })
          })
      })

      it("should create a stylesheet file for the component", () => {
        expect.assertions(1)
        return rcg
          .generate("TestComponent", { stylesheet: true })
          .then(paths => {
            expect(getDirContents(paths.root)).toContain("styles.css")
          })
      })

      it("should create an empty stylesheet file", () => {
        expect.assertions(1)
        return rcg
          .generate("TestComponent", { stylesheet: true })
          .then(paths => {
            const stylesheet: string = fs.readFileSync(
              path.resolve(paths.stylesheet),
              {
                encoding: "utf8"
              }
            )
            expect(stylesheet.trim()).toBe("")
          })
      })
    })

    describe("given that the ES6 Class option is set to true", () => {
      it("should create a valid React Component using the ES6 class template inside the default components home dir", () => {
        expect.assertions(1)
        return rcg
          .generate("TestComponent", {
            type: "es6class"
          })
          .then(paths => {
            const testComponent: string = fs.readFileSync(
              path.resolve(paths.main),
              {
                encoding: "utf8"
              }
            )
            expect(
              validateES6ClassComponent(testComponent, "TestComponent")
            ).toBe(true)
          })
      })
    })

    describe("given that the container option is set to true", () => {
      it("should return a path object with the Containers dir as home of component", () => {
        expect.assertions(2)
        return rcg
          .generate("TestComponent", {
            container: true
          })
          .then(paths => {
            expect(paths.root).toEqual(
              path.resolve(containersDir, "TestComponent")
            )
            expect(paths.main).toEqual(
              path.resolve(containersDir, "TestComponent", "TestComponent.js")
            )
          })
      })

      describe("given that the ES6 Class option is set to true", () => {
        it("should create a valid React Component using the ES6 class template inside the Containers home dir", () => {
          expect.assertions(2)
          return rcg
            .generate("TestComponent", {
              container: true,
              type: "es6class"
            })
            .then(paths => {
              const testComponent: string = fs.readFileSync(
                path.resolve(paths.main),
                {
                  encoding: "utf8"
                }
              )
              expect(paths.root).toEqual(
                path.resolve(containersDir, "TestComponent")
              )
              expect(
                validateES6ClassComponent(testComponent, "TestComponent")
              ).toBe(true)
            })
        })
      })
    })

    describe("given that a component path already exists", () => {
      beforeEach(() => {
        mock({
          src: {
            components: {
              TestComponent: {
                "TestComponent.js": "",
                "index.js": "",
                "styles.css": ""
              }
            },
            ...mockDefaultTemplatePaths
          }
        })
      })

      it("should overwrite files inside component", () => {
        expect.assertions(3)
        expect(getDirContents(resolveInComponents("TestComponent"))).toContain(
          "TestComponent.js"
        )

        return rcg
          .generate("TestComponent", {
            type: "es6class"
          })
          .then(paths => {
            const testComponent: string = fs.readFileSync(
              path.resolve(paths.main),
              {
                encoding: "utf8"
              }
            )
            expect(
              validateES6ClassComponent(testComponent, "TestComponent")
            ).toBe(true)
            expect(
              validateStatelessFunctionalComponent(
                testComponent,
                "TestComponent"
              )
            ).toBe(false)
          })
      })

      it("should remove unneeded files", () => {
        expect.assertions(3)
        expect(getDirContents(resolveInComponents("TestComponent"))).toContain(
          "TestComponent.js"
        )
        return rcg.generate("TestComponent").then(paths => {
          expect(
            getDirContents(resolveInComponents("TestComponent"))
          ).not.toContain("index.js")
          expect(
            getDirContents(resolveInComponents("TestComponent"))
          ).not.toContain("styles.css")
        })
      })
      describe("given a component name with nested path", () => {
        it("should overwrite files and remove unneeded ones", () => {
          mock({
            src: {
              components: {
                ParentDir: {
                  TestComponent: {
                    "TestComponent.js": "",
                    "index.js": "",
                    "styles.css": ""
                  }
                }
              },
              ...mockDefaultTemplatePaths
            }
          })
          expect.assertions(5)
          expect(
            getDirContents(resolveInComponents("ParentDir", "TestComponent"))
          ).toContain("TestComponent.js")

          return rcg
            .generate("ParentDir/TestComponent", {
              type: "es6class"
            })
            .then(paths => {
              const testComponent: string = fs.readFileSync(
                path.resolve(paths.main),
                {
                  encoding: "utf8"
                }
              )
              expect(
                validateES6ClassComponent(testComponent, "TestComponent")
              ).toBe(true)
              expect(
                validateStatelessFunctionalComponent(
                  testComponent,
                  "TestComponent"
                )
              ).toBe(false)
              expect(
                getDirContents(
                  resolveInComponents("ParentDir", "TestComponent")
                )
              ).not.toContain("index.js")
              expect(
                getDirContents(
                  resolveInComponents("ParentDir", "TestComponent")
                )
              ).not.toContain("styles.css")
            })
        })
      })
    })
  })

  describe("given a global configuration with custom extensions for JS files and stylesheet", () => {
    beforeEach(() => {
      componentsDir = path.resolve(process.cwd(), "components")
    })

    const config = {
      extensions: {
        js: {
          main: "jsx"
        },
        stylesheet: {
          main: "scss"
        }
      }
    }

    const rcg = reactCG(config)

    it("should create a Main Component file with custom JSX extension", () => {
      expect.assertions(1)
      return rcg.generate("TestComponent").then(paths => {
        expect(getDirContents(paths.root)).toContain("TestComponent.jsx")
      })
    })

    it("should create a index JS file with default JS extension", () => {
      expect.assertions(1)
      return rcg.generate("TestComponent", { index: true }).then(paths => {
        expect(getDirContents(paths.root)).toContain("index.js")
      })
    })

    it("should create a Main Stylesheet file with custom SCSS extension", () => {
      expect.assertions(1)
      return rcg.generate("TestComponent", { stylesheet: true }).then(paths => {
        expect(getDirContents(paths.root)).toContain("styles.scss")
      })
    })
  })

  describe("given no global configuration file", () => {
    beforeEach(() => {
      componentsDir = path.resolve(process.cwd(), "components")
      containersDir = path.resolve(process.cwd(), "containers")
    })

    const rcg = reactCG()

    it("should create one directory inside the default components home directory", () => {
      expect.assertions(1)
      return rcg.generate("TestComponent").then(componentPaths => {
        expect(resolveInComponents("TestComponent")).toEqual(
          componentPaths.root
        )
      })
    })

    describe("given the container option is set to true", () => {
      it("should create one directory inside the default containers home directory", () => {
        expect.assertions(1)
        return rcg
          .generate("TestComponent", {
            container: true
          })
          .then(componentPaths => {
            expect(resolveInContainers("TestComponent")).toEqual(
              componentPaths.root
            )
          })
      })
    })
  })

  describe("given a global configuration with custom paths for templates", () => {
    let templatesDir

    const templateString: string = fs.readFileSync(
      path.resolve("./src/lib/ReactComponent/templates/mainFileCustomJSX.js"),
      {
        encoding: "utf8"
      }
    )

    beforeEach(() => {
      componentsDir = path.resolve(process.cwd(), "client", "app", "components")
      containersDir = path.resolve(process.cwd(), "client", "app", "containers")
      templatesDir = path.resolve(process.cwd(), "client", "app", "templates")

      mock({
        "client/app/templates": {
          [constants.SFC_TEMPLATE_FILE_NAME]: mockCustomTemplates.customJSX
        },
        src: {
          ...mockDefaultTemplatePaths
        }
      })
    })

    const config = {
      paths: {
        components: "./client/app/components",
        containers: "./client/app/containers",
        templates: "./client/app/templates"
      }
    }

    const rcg = reactCG(config)

    it("should generate a valid React component using the custom template provided in config", () => {
      expect.assertions(2)
      return rcg.generate("TestComponent").then(paths => {
        const testComponent: string = fs.readFileSync(
          path.resolve(paths.main),
          {
            encoding: "utf8"
          }
        )
        expect(
          validateStatelessFunctionalComponent(testComponent, "TestComponent")
        ).toBe(true)
        expect(validateJSXIdentifier(testComponent, "CustomComponent")).toBe(
          true
        )
      })
    })
  })

  // IMPORTANT: Always make sure to place this mock.restore() before the end of the describe("generate") block,
  // otherwise the rest of the test suites won't work
  afterEach(() => {
    mock.restore()
  })
})
