import path from 'path'
import makeInitGenerator from '../init'
import constants from '../../Plugin/constants'

describe('init', () => {
  let config

  const emitter = {
    emit: jest.fn(),
  }

  const pluginPrefix = constants.PLUGIN_PREFIX

  const loadedPlugins = [
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

  const loadFn = jest.fn().mockReturnValue([...loadedPlugins])

  const initGenerator = makeInitGenerator(emitter, loadFn)

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

    it('should emit pluginsLoaded event with an array of all loaded plugins', () => {
      initGenerator(config)
      expect(emitter.emit).toHaveBeenCalledWith('pluginsLoaded', loadedPlugins)
    })
  })
})
