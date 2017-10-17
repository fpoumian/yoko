import path from 'path'
import makeInitGenerator from '../init'
import constants from '../../Plugin/constants'

describe('init', () => {
  let config

  const emitter = {
    emit: jest.fn(),
  }

  const pluginPrefix = constants.PLUGIN_PREFIX

  const resolvedPlugins = [
    {
      name: 'index-file',
      path: path.resolve(
        __dirname,
        'node_modules',
        `${pluginPrefix}-index-file`
      ),
    },
    {
      name: 'main-file',
      path: path.resolve(
        __dirname,
        'node_modules',
        `${pluginPrefix}-main-file`
      ),
    },
    {
      name: 'stylesheet-file',
      path: path.resolve(
        __dirname,
        'node_modules',
        `${pluginPrefix}-stylesheet-file`
      ),
    },
  ]
  const resolveFn = jest.fn().mockReturnValue([...resolvedPlugins])

  const loadFn = jest.fn()

  const initGenerator = makeInitGenerator(emitter, resolveFn, loadFn)

  describe('given a configuration object with one uninstalled plugin', () => {
    beforeEach(() => {
      config = {
        plugins: ['tests-file'],
      }
    })

    it('should emit pluginsRegistered event with an array of all registered plugins', () => {
      initGenerator(config)
      expect(emitter.emit).toHaveBeenCalledWith('pluginsRegistered', [
        'main-file',
        'index-file',
        'stylesheet-file',
        'tests-file',
      ])
    })
  })
})
