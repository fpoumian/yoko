/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import fs from "fs"
import path from "path"

import * as constants from "../../src/lib/Template/constants"

const mainFilePluginPath = require.resolve("react-presto-main-file")
const indexFilePluginPath = require.resolve("react-presto-index-file")
const testsFilePluginPath = require.resolve("react-presto-tests-file")

export default function mockFileSystem() {
  return {
    node_modules: {
      "react-presto-main-file": {
        "index.js": fs.readFileSync(mainFilePluginPath, "utf8"),
        templates: {
          [constants.SFC_TEMPLATE_FILE_NAME]: fs.readFileSync(
            path.resolve(
              path.dirname(mainFilePluginPath),
              "templates",
              constants.SFC_TEMPLATE_FILE_NAME
            )
          ),
          [constants.ES6_CLASS_TEMPLATE_FILE_NAME]: fs.readFileSync(
            path.resolve(
              path.dirname(mainFilePluginPath),
              "templates",
              constants.ES6_CLASS_TEMPLATE_FILE_NAME
            )
          )
        }
      },
      "react-presto-index-file": {
        "index.js": fs.readFileSync(
          require.resolve("react-presto-index-file"),
          "utf8"
        ),
        templates: {
          [constants.INDEX_TEMPLATE_FILE_NAME]: fs.readFileSync(
            path.resolve(
              path.dirname(indexFilePluginPath),
              "templates",
              constants.INDEX_TEMPLATE_FILE_NAME
            )
          )
        }
      },
      "react-presto-tests-file": {
        "index.js": fs.readFileSync(
          require.resolve("react-presto-tests-file"),
          "utf8"
        ),
        templates: {
          [constants.TESTS_FILE_TEMPLATE_FILE_NAME]: fs.readFileSync(
            path.resolve(
              path.dirname(testsFilePluginPath),
              "templates",
              constants.TESTS_FILE_TEMPLATE_FILE_NAME
            )
          )
        }
      },
      "react-presto-stylesheet-file": {
        "index.js": fs.readFileSync(
          require.resolve("react-presto-stylesheet-file"),
          "utf8"
        )
      }
    },
    app: {
      templates: {
        [constants.SFC_TEMPLATE_FILE_NAME]: fs.readFileSync(
          path.resolve(__dirname, "..", "templates", "mainFileCustomJSX.js"),
          "utf8"
        )
      }
    }
  }
}
