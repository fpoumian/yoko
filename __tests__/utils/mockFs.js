/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import fs from 'fs'
import path from 'path'

import pluginConstants from '../../src/lib/plugin/constants'

const mainPluginName = `${pluginConstants.PLUGIN_PREFIX}-main-file`
const indexPluginName = `${pluginConstants.PLUGIN_PREFIX}-index-file`
const stylesheetPluginName = `${pluginConstants.PLUGIN_PREFIX}-stylesheet-file`
const testsPluginName = `${pluginConstants.PLUGIN_PREFIX}-tests-file`

const mainFilePluginPath = require.resolve(mainPluginName)
const indexFilePluginPath = require.resolve(indexPluginName)
const testsFilePluginPath = require.resolve(testsPluginName)

const templateConstants = {
  TEMPLATES_HOME: path.resolve(__dirname, 'templates'),
  SFC_TEMPLATE_FILE_NAME: 'stateless-functional-component.js',
  ES6_CLASS_TEMPLATE_FILE_NAME: 'es6-class-component.js',
  INDEX_TEMPLATE_FILE_NAME: 'index-file.js',
  TESTS_FILE_TEMPLATE_FILE_NAME: 'tests-file.js',
}

export default function mockFileSystem() {
  return {
    node_modules: {
      // NOTE: tests will fail if this files are not directly copied.
      prettier: {
        'parser-babylon.js': fs.readFileSync(
          path.resolve('./node_modules/prettier/parser-babylon.js')
        ),
      },
      joi: {
        'package.json': fs.readFileSync(
          path.resolve('./node_modules/joi/package.json')
        ),
        lib: {
          'schemas.js': fs.readFileSync(
            path.resolve('./node_modules/joi/lib/schemas.js')
          ),
          'index.js': fs.readFileSync(
            path.resolve('./node_modules/joi/lib/index.js')
          ),
        },
      },
      [mainPluginName]: {
        'index.js': fs.readFileSync(mainFilePluginPath, 'utf8'),
        templates: {
          [templateConstants.SFC_TEMPLATE_FILE_NAME]: fs.readFileSync(
            path.resolve(
              path.dirname(mainFilePluginPath),
              'templates',
              templateConstants.SFC_TEMPLATE_FILE_NAME
            )
          ),
          [templateConstants.ES6_CLASS_TEMPLATE_FILE_NAME]: fs.readFileSync(
            path.resolve(
              path.dirname(mainFilePluginPath),
              'templates',
              templateConstants.ES6_CLASS_TEMPLATE_FILE_NAME
            )
          ),
        },
      },
      [indexPluginName]: {
        'index.js': fs.readFileSync(require.resolve(indexPluginName), 'utf8'),
        templates: {
          [templateConstants.INDEX_TEMPLATE_FILE_NAME]: fs.readFileSync(
            path.resolve(
              path.dirname(indexFilePluginPath),
              'templates',
              templateConstants.INDEX_TEMPLATE_FILE_NAME
            )
          ),
        },
      },
      [testsPluginName]: {
        'index.js': fs.readFileSync(require.resolve(testsPluginName), 'utf8'),
        templates: {
          [templateConstants.TESTS_FILE_TEMPLATE_FILE_NAME]: fs.readFileSync(
            path.resolve(
              path.dirname(testsFilePluginPath),
              'templates',
              templateConstants.TESTS_FILE_TEMPLATE_FILE_NAME
            )
          ),
        },
      },
      [stylesheetPluginName]: {
        'index.js': fs.readFileSync(
          require.resolve(stylesheetPluginName),
          'utf8'
        ),
      },
    },
  }
}
