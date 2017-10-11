/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import fs from "fs"
import path from "path"

import * as constants from "../../src/lib/Template/constants"
import pluginConstants from "../../src/lib/Plugin/constants"

const mainPluginName = `${pluginConstants.PLUGIN_PREFIX}-main-file`
const indexPluginName = `${pluginConstants.PLUGIN_PREFIX}-index-file`
const stylesheetPluginName = `${pluginConstants.PLUGIN_PREFIX}-stylesheet-file`
const testsPluginName = `${pluginConstants.PLUGIN_PREFIX}-tests-file`

const mainFilePluginPath = require.resolve(mainPluginName)
const indexFilePluginPath = require.resolve(indexPluginName)
const testsFilePluginPath = require.resolve(testsPluginName)

export default function mockFileSystem() {
  return {
    node_modules: {
      [mainPluginName]: {
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
      [indexPluginName]: {
        "index.js": fs.readFileSync(require.resolve(indexPluginName), "utf8"),
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
      [testsPluginName]: {
        "index.js": fs.readFileSync(require.resolve(testsPluginName), "utf8"),
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
      [stylesheetPluginName]: {
        "index.js": fs.readFileSync(
          require.resolve(stylesheetPluginName),
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
