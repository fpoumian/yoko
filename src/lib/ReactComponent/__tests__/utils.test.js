import path from "path"
import fs from "fs"
import mock from "mock-fs"

import { getFilesTemplatesPaths, reduceComponentPaths } from "../utils"
import * as constants from "../constants"

describe("reduceComponentPaths", () => {
  const component = {
    getPath: () => path.resolve(__dirname),
    getFiles: () => {},
    getName: () => ""
  }

  const filePaths = [
    {
      main: path.resolve(__dirname, "TestComponent.js")
    },
    {
      index: path.resolve(__dirname, "index.js")
    },
    {
      stylesheet: path.resolve(__dirname, "styles.css")
    }
  ]

  it("should return a reduced object of paths", () => {
    expect(reduceComponentPaths(component, filePaths)).toEqual({
      root: path.resolve(__dirname),
      main: path.resolve(__dirname, "TestComponent.js"),
      index: path.resolve(__dirname, "index.js"),
      stylesheet: path.resolve(__dirname, "styles.css")
    })
  })
})

describe("getFilesTemplatesPaths", () => {
  const defaultTemplatesDir = path.resolve(__dirname, "..", "templates")
  describe("given a config object with no templates path specified", () => {
    const config = {}

    describe("given an options object with no type specified", () => {
      const options = {}

      it("should return an object with paths pointing to the default templates and SFC as the Main file template", () => {
        expect(getFilesTemplatesPaths(config, options)).toEqual({
          main: path.resolve(
            defaultTemplatesDir,
            constants.SFC_TEMPLATE_FILE_NAME
          ),
          index: path.resolve(
            defaultTemplatesDir,
            constants.INDEX_TEMPLATE_FILE_NAME
          )
        })
      })
    })
    describe("given an options object with es6class type specified", () => {
      const options = {
        type: "es6class"
      }

      it("should return an object with paths pointing to the default templates and SFC as the Main file template", () => {
        expect(getFilesTemplatesPaths(config, options)).toEqual({
          main: path.resolve(
            defaultTemplatesDir,
            constants.ES6_CLASS_TEMPLATE_FILE_NAME
          ),
          index: path.resolve(
            defaultTemplatesDir,
            constants.INDEX_TEMPLATE_FILE_NAME
          )
        })
      })
    })
  })
  describe("given a config object with a templates path specified", () => {
    beforeEach(() => {
      mock({
        src: {
          templates: {}
        }
      })
    })

    const config = {
      paths: {
        templates: path.resolve(process.cwd(), "src", "templates")
      }
    }

    describe("given an options object with no type specified", () => {
      const options = {}

      describe("given that the templates folder does not have any templates", () => {
        it("should return an object with all the default template paths", () => {
          expect(getFilesTemplatesPaths(config, options)).toEqual({
            main: path.resolve(
              defaultTemplatesDir,
              constants.SFC_TEMPLATE_FILE_NAME
            ),
            index: path.resolve(
              defaultTemplatesDir,
              constants.INDEX_TEMPLATE_FILE_NAME
            )
          })
        })
      })

      describe("given that the templates folder has a StatelessFunctionalComponent template", () => {
        beforeEach(() => {
          mock({
            "src/templates": {
              [constants.SFC_TEMPLATE_FILE_NAME]: ""
            }
          })
        })

        it("should return an object with the path to the custom SFC template in the main property", () => {
          expect(getFilesTemplatesPaths(config, options, fs)).toEqual({
            main: path.resolve(
              process.cwd(),
              "src",
              "templates",
              constants.SFC_TEMPLATE_FILE_NAME
            ),
            index: path.resolve(
              defaultTemplatesDir,
              constants.INDEX_TEMPLATE_FILE_NAME
            )
          })
        })
      })
      describe("given that the templates folder has an indexFile template", () => {
        beforeEach(() => {
          mock({
            "src/templates": {
              [constants.INDEX_TEMPLATE_FILE_NAME]: ""
            }
          })
        })

        it("should return an object with the path to the custom index template in the index property", () => {
          expect(getFilesTemplatesPaths(config, options, fs)).toEqual({
            main: path.resolve(
              defaultTemplatesDir,
              constants.SFC_TEMPLATE_FILE_NAME
            ),
            index: path.resolve(
              process.cwd(),
              "src",
              "templates",
              constants.INDEX_TEMPLATE_FILE_NAME
            )
          })
        })
      })
    })

    describe("given an options object with es6class type specified", () => {
      const options = {
        type: "esclass"
      }
    })

    afterEach(() => {
      mock.restore()
    })
  })
})
