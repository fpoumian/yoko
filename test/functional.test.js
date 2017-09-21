import mock from "mock-fs"
import fs from "fs"
import path from "path"
import eventToPromise from "event-to-promise"
import { ArgumentError } from "common-errors"

import reactPresto from "../src"
import {
  validateStatelessFunctionalComponent,
  validateIndexFile,
  validateES6ClassComponent,
  validateJSXIdentifier,
  validateTestsFile
} from "../src/lib/ReactComponent/validation"
import * as constants from "../src/lib/Template/constants"
import mockFs from "./mockFs"

function getDirContents(path) {
  return fs.readdirSync(path)
}

/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

const defaultTemplatesDirRelativePath = `${constants.TEMPLATES_HOME}/`

const mockDefaultTemplatePaths = {
  lib: {
    Template: {
      templates: {
        [constants.SFC_TEMPLATE_FILE_NAME]: require(defaultTemplatesDirRelativePath +
          constants.SFC_TEMPLATE_FILE_NAME).default,
        [constants.ES6_CLASS_TEMPLATE_FILE_NAME]: require(defaultTemplatesDirRelativePath +
          constants.ES6_CLASS_TEMPLATE_FILE_NAME).default,
        [constants.INDEX_TEMPLATE_FILE_NAME]: require(defaultTemplatesDirRelativePath +
          constants.INDEX_TEMPLATE_FILE_NAME).default,
        [constants.TESTS_FILE_TEMPLATE_FILE_NAME]: require(defaultTemplatesDirRelativePath +
          constants.TESTS_FILE_TEMPLATE_FILE_NAME).default
      }
    }
  }
}

describe("generate", () => {
  let srcDir
  let componentsDir
  let containersDir
  let resolveInComponents
  let resolveInContainers

  beforeEach(() => {
    mockFs()
    resolveInComponents = (...items) => path.resolve(componentsDir, ...items)
    resolveInContainers = (...items) => path.resolve(containersDir, ...items)
  })

  describe("given a global configuration with custom relative paths for components and containers", () => {
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

    const generator = reactPresto(config)

    describe("given no additional component options were provided", () => {
      it("should create one directory inside of components Home directory", done => {
        expect.assertions(1)

        generator.generate("TestComponent").on("done", paths => {
          expect(resolveInComponents("TestComponent")).toEqual(paths.root)
          done()
        })
      })

      it("should return a path object with only root and main properties", done => {
        expect.assertions(1)

        generator.generate("TestComponent").on("done", paths => {
          expect(paths).toEqual({
            root: resolveInComponents("TestComponent"),
            main: resolveInComponents("TestComponent", "TestComponent.js")
          })
          done()
        })
      })

      it("should create five directories inside of components Home directory", () => {
        expect.assertions(1)

        const promises = [
          eventToPromise(generator.generate("ComponentOne"), "done"),
          eventToPromise(generator.generate("ComponentTwo"), "done"),
          eventToPromise(generator.generate("ComponentThree"), "done"),
          eventToPromise(generator.generate("ComponentFour"), "done"),
          eventToPromise(generator.generate("ComponenFive"), "done")
        ]

        return Promise.all(promises).then(() => {
          expect(getDirContents(componentsDir)).toHaveLength(5)
        })
      })

      it("should emit a mainFileWritten event", done => {
        expect.assertions(1)

        generator.generate("TestComponent").on("mainFileWritten", path => {
          expect(path).toEqual(
            resolveInComponents("TestComponent", "TestComponent.js")
          )
          done()
        })
      })

      it("should create components directories with a recursive path", done => {
        expect.assertions(1)
        generator
          .generate("ParentDirectory/TestComponent")
          .on("done", paths => {
            expect(paths).toHaveProperty(
              "root",
              resolveInComponents("ParentDirectory", "TestComponent")
            )
            done()
          })
      })

      it("should create component inside existing directory if it already exists", () => {
        expect.assertions(1)

        const promises = [
          eventToPromise(
            generator.generate("ParentDirectory/ComponentOne"),
            "done"
          ),
          eventToPromise(
            generator.generate("ParentDirectory/ComponentTwo"),
            "done"
          )
        ]

        return Promise.all(promises).then(() => {
          expect(
            getDirContents(resolveInComponents("ParentDirectory"))
          ).toHaveLength(2)
        })
      })

      it("should create a main JS file for the component", done => {
        expect.assertions(1)
        generator.generate("TestComponent").on("done", paths => {
          expect(getDirContents(paths.root)).toContain("TestComponent.js")
          done()
        })
      })

      it("should create main JS files for multiple components inside existing directories", () => {
        expect.assertions(2)

        const promises = [
          eventToPromise(
            generator.generate("ParentDirectory/ComponentOne"),
            "done"
          ),
          eventToPromise(
            generator.generate("ParentDirectory/ComponentTwo"),
            "done"
          )
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

      it("should create a valid React Component using the default Stateless Functional Component template", done => {
        expect.assertions(1)
        generator.generate("TestComponent").on("done", paths => {
          const testComponent = fs.readFileSync(path.resolve(paths.main), {
            encoding: "utf8"
          })
          expect(
            validateStatelessFunctionalComponent(testComponent, "TestComponent")
          ).toBe(true)
          done()
        })
      })

      it("should create a valid React Component within parent directory", done => {
        expect.assertions(1)
        generator
          .generate("ParentDirectory/TestComponent")
          .on("done", paths => {
            const testComponent = fs.readFileSync(path.resolve(paths.main), {
              encoding: "utf8"
            })
            expect(
              validateStatelessFunctionalComponent(
                testComponent,
                "TestComponent"
              )
            ).toBe(true)
            done()
          })
      })
    })

    describe("given that the index option is set to true", () => {
      it("should return a path object with root, index and main properties", done => {
        expect.assertions(1)
        generator
          .generate("TestComponent", {
            index: true
          })
          .on("done", paths => {
            expect(paths).toEqual({
              root: resolveInComponents("TestComponent"),
              main: resolveInComponents("TestComponent", "TestComponent.js"),
              index: resolveInComponents("TestComponent", "index.js")
            })
            done()
          })
      })

      it("should create a index JS file for the component", done => {
        expect.assertions(1)
        generator
          .generate("TestComponent", { index: true })
          .on("done", paths => {
            expect(getDirContents(paths.root)).toContain("index.js")
            done()
          })
      })

      it("should create a valid index.js file", done => {
        expect.assertions(1)
        generator
          .generate("TestComponent", { index: true })
          .on("done", paths => {
            const indexFile = fs.readFileSync(path.resolve(paths.index), {
              encoding: "utf8"
            })
            expect(validateIndexFile(indexFile, "TestComponent")).toBe(true)
            done()
          })
      })

      it("should create index.js files for first two components, but not the third one", () => {
        expect.assertions(3)

        const promises = [
          eventToPromise(
            generator.generate("ParentDirectory/ComponentOne", { index: true }),
            "done"
          ),
          eventToPromise(
            generator.generate("ParentDirectory/ComponentTwo", { index: true }),
            "done"
          ),
          eventToPromise(
            generator.generate("ParentDirectory/ComponentThree"),
            "done"
          )
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

      it("should emit a indexFileWritten event", done => {
        expect.assertions(1)

        generator
          .generate("TestComponent", { index: true })
          .on("indexFileWritten", path => {
            expect(path).toEqual(
              resolveInComponents("TestComponent", "index.js")
            )
            done()
          })
      })
    })

    describe("given that the stylesheet option is set to true", () => {
      it("should return a path object with root, stylesheet and main properties", done => {
        expect.assertions(1)
        generator
          .generate("TestComponent", {
            stylesheet: true
          })
          .on("done", paths => {
            expect(paths).toEqual({
              root: resolveInComponents("TestComponent"),
              main: resolveInComponents("TestComponent", "TestComponent.js"),
              stylesheet: resolveInComponents("TestComponent", "styles.css")
            })
            done()
          })
      })

      it("should create a stylesheet file for the component", done => {
        expect.assertions(1)
        generator
          .generate("TestComponent", { stylesheet: true })
          .on("done", paths => {
            expect(getDirContents(paths.root)).toContain("styles.css")
            done()
          })
      })

      it("should emit a stylesheetFileWritten event", done => {
        expect.assertions(1)

        generator
          .generate("TestComponent", { stylesheet: true })
          .on("stylesheetFileWritten", path => {
            expect(path).toEqual(
              resolveInComponents("TestComponent", "styles.css")
            )
            done()
          })
      })

      it("should create an empty stylesheet file", done => {
        expect.assertions(1)
        generator
          .generate("TestComponent", { stylesheet: true })
          .on("done", paths => {
            const stylesheet = fs.readFileSync(path.resolve(paths.stylesheet), {
              encoding: "utf8"
            })
            expect(stylesheet.trim()).toBe("")
            done()
          })
      })
    })

    describe("given that the test option is set to true", () => {
      it("should return a path object with root, tests and main properties", done => {
        expect.assertions(1)
        generator
          .generate("TestComponent", {
            tests: true
          })
          .on("done", paths => {
            expect(paths).toEqual({
              root: resolveInComponents("TestComponent"),
              main: resolveInComponents("TestComponent", "TestComponent.js"),
              tests: resolveInComponents(
                "TestComponent",
                "__tests__",
                "TestComponent.test.js"
              )
            })
            done()
          })
      })
      it("should create a test file for the component", done => {
        expect.assertions(1)
        generator
          .generate("TestComponent", { tests: true })
          .on("done", paths => {
            expect(
              getDirContents(path.resolve(paths.root, "__tests__"))
            ).toContain("TestComponent.test.js")
            done()
          })
      })
      it("should create a valid test file", done => {
        expect.assertions(1)
        generator
          .generate("TestComponent", { tests: true })
          .on("done", paths => {
            const testsFile = fs.readFileSync(path.resolve(paths.tests), {
              encoding: "utf8"
            })
            expect(validateTestsFile(testsFile, "TestComponent")).toBe(true)
            done()
          })
      })

      it("should emit a testsFileWritten event", done => {
        expect.assertions(1)

        generator
          .generate("TestComponent", { tests: true })
          .on("testsFileWritten", path => {
            expect(path).toEqual(
              resolveInComponents(
                "TestComponent",
                "__tests__",
                "TestComponent.test.js"
              )
            )
            done()
          })
      })
    })

    describe("given that the ES6 Class option is set to true", () => {
      it("should create a valid React Component using the ES6 class template inside the default components home dir", done => {
        expect.assertions(1)
        generator
          .generate("TestComponent", {
            type: "es6class"
          })
          .on("done", paths => {
            const testComponent = fs.readFileSync(path.resolve(paths.main), {
              encoding: "utf8"
            })
            expect(
              validateES6ClassComponent(testComponent, "TestComponent")
            ).toBe(true)
            done()
          })
      })
    })

    describe("given that the container option is set to true", () => {
      it("should return a path object with the Containers dir as home of component", done => {
        expect.assertions(2)
        generator
          .generate("TestComponent", {
            container: true
          })
          .on("done", paths => {
            expect(paths.root).toEqual(
              path.resolve(containersDir, "TestComponent")
            )
            expect(paths.main).toEqual(
              path.resolve(containersDir, "TestComponent", "TestComponent.js")
            )
            done()
          })
      })

      describe("given that the ES6 Class option is set to true", () => {
        it("should create a valid React Component using the ES6 class template inside the Containers home dir", done => {
          expect.assertions(2)
          generator
            .generate("TestComponent", {
              container: true,
              type: "es6class"
            })
            .on("done", paths => {
              const testComponent = fs.readFileSync(path.resolve(paths.main), {
                encoding: "utf8"
              })
              expect(paths.root).toEqual(
                path.resolve(containersDir, "TestComponent")
              )
              expect(
                validateES6ClassComponent(testComponent, "TestComponent")
              ).toBe(true)
              done()
            })
        })
      })
    })

    xdescribe("given that a component path already exists", () => {
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

      it("should overwrite files inside component", done => {
        expect.assertions(3)
        expect(getDirContents(resolveInComponents("TestComponent"))).toContain(
          "TestComponent.js"
        )

        generator
          .generate("TestComponent", {
            type: "es6class"
          })
          .on("done", paths => {
            const testComponent = fs.readFileSync(path.resolve(paths.main), {
              encoding: "utf8"
            })
            expect(
              validateES6ClassComponent(testComponent, "TestComponent")
            ).toBe(true)
            expect(
              validateStatelessFunctionalComponent(
                testComponent,
                "TestComponent"
              )
            ).toBe(false)
            done()
          })
      })

      it("should remove unneeded files", done => {
        expect.assertions(3)
        expect(getDirContents(resolveInComponents("TestComponent"))).toContain(
          "TestComponent.js"
        )
        generator.generate("TestComponent").on("done", () => {
          expect(
            getDirContents(resolveInComponents("TestComponent"))
          ).not.toContain("index.js")
          expect(
            getDirContents(resolveInComponents("TestComponent"))
          ).not.toContain("styles.css")
          done()
        })
      })
      describe("given a component name with nested path", () => {
        it("should overwrite files and remove unneeded ones", done => {
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

          generator
            .generate("ParentDir/TestComponent", {
              type: "es6class"
            })
            .on("done", paths => {
              const testComponent = fs.readFileSync(path.resolve(paths.main), {
                encoding: "utf8"
              })
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
              done()
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

    const generator = reactPresto(config)

    it("should create a Main Component file with custom JSX extension", done => {
      expect.assertions(1)
      generator.generate("TestComponent").on("done", paths => {
        expect(getDirContents(paths.root)).toContain("TestComponent.jsx")
        done()
      })
    })

    it("should create a index JS file with default JS extension", done => {
      expect.assertions(1)
      generator.generate("TestComponent", { index: true }).on("done", paths => {
        expect(getDirContents(paths.root)).toContain("index.js")
        done()
      })
    })

    it("should create a Main Stylesheet file with custom SCSS extension", done => {
      expect.assertions(1)
      generator
        .generate("TestComponent", { stylesheet: true })
        .on("done", paths => {
          expect(getDirContents(paths.root)).toContain("styles.scss")
          done()
        })
    })
  })

  describe("given no global configuration object", () => {
    beforeEach(() => {
      componentsDir = path.resolve(process.cwd(), "components")
      containersDir = path.resolve(process.cwd(), "containers")
    })

    const rcg = reactPresto()

    it("should create one directory inside the default components home directory", done => {
      expect.assertions(1)
      rcg.generate("TestComponent").on("done", componentPaths => {
        expect(resolveInComponents("TestComponent")).toEqual(
          componentPaths.root
        )
        done()
      })
    })

    describe("given the container option is set to true", () => {
      it("should create one directory inside the default containers home directory", done => {
        expect.assertions(1)
        rcg
          .generate("TestComponent", {
            container: true
          })
          .on("done", componentPaths => {
            expect(resolveInContainers("TestComponent")).toEqual(
              componentPaths.root
            )
            done()
          })
      })
    })
  })

  xdescribe(
    "given a global configuration with custom paths for templates",
    () => {
      const config = {
        paths: {
          templates: "./client/app/templates/"
        }
      }

      const rcg = reactPresto(config)

      it("should generate a valid React component using the custom template provided in config", done => {
        expect.assertions(2)
        rcg.generate("TestComponent").on("done", paths => {
          const testComponent = fs.readFileSync(path.resolve(paths.main), {
            encoding: "utf8"
          })
          expect(
            validateStatelessFunctionalComponent(testComponent, "TestComponent")
          ).toBe(true)
          expect(validateJSXIdentifier(testComponent, "CustomComponent")).toBe(
            true
          )
          done()
        })
      })
    }
  )

  describe("given an invalid argument type for the componentName and options arguments", () => {
    const generator = reactPresto()
    it("should throw an Error", () => {
      expect(() => {
        generator.generate([1, 2, 3])
      }).toThrowError()
      expect(() => {
        generator.generate("C", [1, 2])
      }).toThrowError()
    })
    it("should throw an Error with correct type", () => {
      expect(() => {
        generator.generate([1, 2, 3], {})
      }).toThrowError(TypeError)
      expect(() => {
        generator.generate("", {})
      }).toThrowError(ArgumentError)
      expect(() => {
        generator.generate("C", [1, 2, 3])
      }).toThrowError(TypeError)
    })
    it("should throw an Error with message", () => {
      expect(() => {
        generator.generate([1, 2, 3], {})
      }).toThrowError(
        "You must provide a String type for the componentName argument. Array provided."
      )
      expect(() => {
        generator.generate("", {})
      }).toThrowError("The componentName argument cannot be an empty string.")
      expect(() => {
        generator.generate("C", [1, 2, 3])
      }).toThrowError(
        "You must provide a plain Object type for the options argument. Array provided."
      )
    })
  })

  // IMPORTANT: Always make sure to place this mock.restore() before the end of the describe("generate") block,
  // otherwise the rest of the test suites won't work!
  afterEach(() => {
    mock.restore()
  })
})
