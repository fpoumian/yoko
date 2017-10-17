import fs from "fs"
import path from "path"
import eventToPromise from "event-to-promise"
import mock from "mock-fs"
import prettier from "prettier"

import judex from "../src"
import {
  validateStatelessFunctionalComponent,
  validateIndexFile,
  validateES6ClassComponent,
  validateJSXIdentifier,
  validateTestsFile
} from "../src/lib/ComponentFile/validation"
import mockFileSystem from "./utils/mockFs"

const mockedFileSystem = mockFileSystem()

function getDirContents(path) {
  return fs.readdirSync(path)
}

/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

describe("judex-component-generator", () => {
  let srcDir
  let componentsDir
  let containersDir
  let resolveInComponents
  let resolveInContainers

  beforeEach(() => {
    // Mock the FileSystem using fs-mock
    mock({
      ...mockedFileSystem
    })
    // Resolve in the Components Home dir (i.e. where all the components should be generated)
    resolveInComponents = (...items) => path.resolve(componentsDir, ...items)
    // Resolve in the Containers Home dir (i.e. where all the containers should be generated)
    resolveInContainers = (...items) => path.resolve(containersDir, ...items)
  })

  describe("given a global configuration with custom relative paths for components and containers", () => {
    beforeEach(() => {
      srcDir = path.resolve(process.cwd(), "src")
      // Components Home
      componentsDir = path.resolve(srcDir, "components")
      // Containers Home
      containersDir = path.resolve(srcDir, "containers")
    })

    const config = {
      paths: {
        components: "./src/components",
        containers: "./src/containers"
      }
    }

    const generator = judex(config)

    describe("when no component options are provided", () => {
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

      it("should be able create multiple directories inside of components home directory", () => {
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

      it("should create components directories with a nested path", done => {
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

      it("should create main component JS files for multiple components inside existing directories", () => {
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
    })

    describe("when the index option is set to true in component options", () => {
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

    describe("when the stylesheet option is set to true in component options", () => {
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

    describe("when the ES6 Class option is set to true", () => {
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

    describe("when the container option is set to true", () => {
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

    describe("when a component path already exists", () => {
      beforeEach(() => {
        mock({
          ...mockedFileSystem,
          src: {
            components: {
              TestComponent: {
                "TestComponent.js": "",
                "index.js": "",
                "styles.css": ""
              }
            }
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

      it("should remove needless files", done => {
        expect.assertions(5)
        expect(getDirContents(resolveInComponents("TestComponent"))).toContain(
          "TestComponent.js"
        )
        expect(getDirContents(resolveInComponents("TestComponent"))).toContain(
          "index.js"
        )
        expect(getDirContents(resolveInComponents("TestComponent"))).toContain(
          "styles.css"
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
        beforeEach(() => {
          mock({
            ...mockedFileSystem,
            src: {
              components: {
                ParentDir: {
                  AnotherComponent: {},
                  TestComponent: {
                    "TestComponent.js": "",
                    "index.js": "",
                    "styles.css": ""
                  }
                }
              }
            }
          })
        })

        it("should only overwrite files for that specific component", done => {
          expect.assertions(2)
          expect(getDirContents(resolveInComponents("ParentDir"))).toContain(
            "AnotherComponent"
          )

          generator.generate("ParentDir/TestComponent").on("done", () => {
            expect(getDirContents(resolveInComponents("ParentDir"))).toContain(
              "AnotherComponent"
            )
            done()
          })
        })

        it("should overwrite files and remove needless ones", done => {
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

    const generator = judex(config)

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

  describe("given a global configuration with component-name-root-dir rule set to false", () => {
    beforeEach(() => {
      componentsDir = path.resolve(process.cwd(), "components")
    })

    const config = {
      rules: {
        "component-name-root-dir": false
      }
    }

    const generator = judex(config)

    it("should create a component that does not use the component name to create a root dir", done => {
      expect.assertions(1)
      generator
        .generate("ComponentRootDirName/TestComponent")
        .on("done", paths => {
          expect(paths).toHaveProperty(
            "root",
            resolveInComponents("ComponentRootDirName")
          )
          done()
        })
    })
    it("should be able to create components that use the components Home dir as the component root dir", done => {
      expect.assertions(1)
      generator.generate("TestComponent").on("done", paths => {
        expect(paths).toHaveProperty(
          "main",
          resolveInComponents("TestComponent.js")
        )
        done()
      })
    })

    it("should be able to handle components with no nested paths and needless file extension", done => {
      expect.assertions(1)
      generator.generate("TestComponent.jsx").on("done", paths => {
        expect(paths).toHaveProperty(
          "main",
          resolveInComponents("TestComponent.js")
        )
        done()
      })
    })

    it("should create a component whose main file has the name of the component", done => {
      expect.assertions(1)
      generator
        .generate("ComponentRootDirName/TestComponent")
        .on("done", paths => {
          expect(paths).toHaveProperty(
            "main",
            resolveInComponents("ComponentRootDirName/TestComponent.js")
          )
          done()
        })
    })

    it("should be able to delete needless files in overwritten components", done => {
      expect.assertions(2)
      const emitter = generator
        .generate("ComponentRootDirName/TestComponent", { index: true })
        .on("done", () => {
          expect(
            getDirContents(resolveInComponents("ComponentRootDirName"))
          ).toContain("index.js")
        })

      emitter.on("done", () => {
        generator
          .generate("ComponentRootDirName/TestComponent", { index: false })
          .on("done", () => {
            expect(
              getDirContents(resolveInComponents("ComponentRootDirName"))
            ).not.toContain("index.js")
            done()
          })
      })
    })
  })

  describe("given no global configuration object", () => {
    beforeEach(() => {
      componentsDir = path.resolve(process.cwd(), "components")
      containersDir = path.resolve(process.cwd(), "containers")
    })

    const generator = judex()

    it("should create one directory inside the default components home directory", done => {
      expect.assertions(1)
      generator.generate("TestComponent").on("done", componentPaths => {
        expect(resolveInComponents("TestComponent")).toEqual(
          componentPaths.root
        )
        done()
      })
    })

    describe("when the container option is set to true", () => {
      it("should create one directory inside the default containers home directory", done => {
        expect.assertions(1)
        generator
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

  describe("given a config with the tests-file plugin and a custom test extension set", () => {
    beforeEach(() => {
      srcDir = path.resolve(process.cwd(), "src")
      // Components Home
      componentsDir = path.resolve(srcDir, "components")
      // Containers Home
      containersDir = path.resolve(srcDir, "containers")
    })

    const config = {
      paths: {
        components: "./src/components",
        containers: "./src/containers"
      },
      extensions: {
        js: {
          tests: "spec.js"
        }
      },
      plugins: ["tests-file"]
    }

    const generator = judex(config)
    describe("when the test option is set to true", () => {
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
                "TestComponent.spec.js"
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
            ).toContain("TestComponent.spec.js")
            done()
          })
      })
      it("should create a valid test file for the component", done => {
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
                "TestComponent.spec.js"
              )
            )
            done()
          })
      })
    })
  })

  describe("given an invalid argument type for the componentName and options arguments", () => {
    const generator = judex()
    it("should throw an Error", () => {
      expect(() => {
        generator.generate([1, 2, 3])
      }).toThrowError()
      expect(() => {
        generator.generate("C", [1, 2])
      }).toThrowError()
    })
  })

  describe("given a global configuration with no formatting option specified", () => {
    const config = {}
    const generator = judex(config)
    it("should generate a component using the default Prettier configuration", done => {
      expect.assertions(1)
      generator.generate("TestComponent").on("done", paths => {
        const testComponent = fs.readFileSync(path.resolve(paths.main), {
          encoding: "utf8"
        })
        expect(prettier.check(testComponent)).toBe(true)
        done()
      })
    })
  })

  describe("given a global configuration with custom Prettier configuration", () => {
    const config = {
      formatting: {
        prettier: {
          semi: false,
          singleQuote: true
        }
      }
    }
    const generator = judex(config)
    it("should generate a component using the specified prettier configuration", done => {
      expect.assertions(1)
      generator.generate("TestComponent").on("done", paths => {
        const testComponent = fs.readFileSync(path.resolve(paths.main), {
          encoding: "utf8"
        })
        expect(prettier.check(testComponent, config.formatting.prettier)).toBe(
          true
        )
        done()
      })
    })
  })

  // TODO: Make this test work with mock-fs
  xdescribe(
    "given a global configuration with custom paths for templates",
    () => {
      let config
      let generator

      beforeEach(() => {
        mock({
          ...mockedFileSystem
        })
        config = {
          paths: {
            templates: path.resolve("./app/templates")
          }
        }
        generator = judex(config)
      })

      it("should generate a valid React component using the custom template provided in config", done => {
        expect.assertions(2)
        generator.generate("TestComponent").on("done", paths => {
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

  // IMPORTANT: Always make sure to place this mock.restore() before the end of the describe("judex-component-generator") block,
  // otherwise the rest of the test suites won't work!
  afterEach(() => {
    mock.restore()
  })
})
