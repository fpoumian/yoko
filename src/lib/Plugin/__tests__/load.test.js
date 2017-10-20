import find from 'lodash/find'
import path from 'path'

import makeLoadPlugins from '../load'

describe('load', () => {
  let loadPlugins
  let loader
  let resolver
  let emitter

  beforeEach(() => {
    emitter = {
      emit: jest.fn(),
    }
  })

  const plugins = ['main-file', 'index-file']

  describe('given that all the plugins exist', () => {
    beforeEach(() => {
      loader = {
        require: jest.fn().mockReturnValue(() => function() {}),
      }
      resolver = {
        resolve: jest.fn().mockReturnValue(path.resolve(__dirname)),
      }
      loadPlugins = makeLoadPlugins(loader, resolver, emitter)
    })

    it('should return an array with a length equal to the amount of plugins found', () => {
      const loadedPlugins = loadPlugins(plugins)
      expect(loadedPlugins).toBeInstanceOf(Array)
      expect(loadedPlugins).toHaveLength(plugins.length)
    })
    it('should return an array of objects with name, path and init properties', () => {
      const loadedPlugins = loadPlugins(plugins)
      const mainFile = find(loadedPlugins, obj => obj.getName() === 'main-file')
      const indexFile = find(
        loadedPlugins,
        obj => obj.getName() === 'index-file'
      )
      expect(mainFile.getName()).toEqual('main-file')
      expect(mainFile.getPath()).toEqual(path.resolve(__dirname))
      expect(mainFile.init).toBeInstanceOf(Function)
      expect(indexFile.getName()).toEqual('index-file')
      expect(indexFile.getPath()).toEqual(path.resolve(__dirname))
      expect(indexFile.init).toBeInstanceOf(Function)
    })
  })
  describe('given that one plugin is not found', () => {
    beforeEach(() => {
      loader = {
        require: jest
          .fn()
          // this will be the main-file plugin
          .mockImplementationOnce(() => function() {})
          // this will be the index-file plugin
          .mockImplementationOnce(() => {
            throw new Error('mockImplementationError')
          }),
      }
      resolver = {
        resolve: jest.fn().mockReturnValue(path.resolve(__dirname)),
      }
      loadPlugins = makeLoadPlugins(loader, resolver, emitter)
    })

    it('should return an array that excludes not loaded plugins', () => {
      const loadedPlugins = loadPlugins(plugins)
      expect(loadedPlugins).toHaveLength(1)
    })

    it('should call the emitter.emit method with a cannotLoadPlugin argument', () => {
      loadPlugins(plugins)
      expect(emitter.emit).toHaveBeenCalledWith(
        'cannotLoadPlugin',
        'judex-plugin-index-file'
      )
    })
  })
})
