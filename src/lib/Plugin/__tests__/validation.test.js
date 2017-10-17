import path from 'path'
import validateFilePlugin from '../validation'

describe('validateFilePlugin', () => {
  let plugin

  describe('given a plugin that returns an init method which returns correct props', () => {
    beforeEach(() => {
      // Mock plugin
      plugin = {
        getName: () => 'main-file',
        init: jest.fn().mockImplementation(() => ({
          name: 'index',
          extension: 'js',
          dir: path.resolve(__dirname),
          role: 'index',
          template: 'IndexFile.js',
        })),
      }
    })

    it('should validate a correct plugin without throwing', () => {
      expect.assertions(1)
      expect(validateFilePlugin(plugin)).toEqual({
        name: 'index',
        extension: 'js',
        dir: path.resolve(__dirname),
        role: 'index',
        template: 'IndexFile.js',
      })
    })
  })
  describe('given a plugin object whose init property is not a function', () => {
    beforeEach(() => {
      plugin = {
        getName: () => 'main-file',
        init: {},
      }
    })

    it('should throw a TypeError exception with correct message', () => {
      expect.assertions(1)
      expect(() => {
        validateFilePlugin(plugin)
      }).toThrowError('Plugin main-file does not export a function.')
    })
  })
  describe('given a plugin object whose init function returns an object with missing name property', () => {
    const plugin = {
      getName: () => 'main-file',
      init: jest.fn().mockReturnValue({
        extension: 'js',
        dir: '',
        role: '',
      }),
    }

    it('should throw an Error indicating missing name prop', () => {
      expect.assertions(1)
      expect(() => {
        validateFilePlugin(plugin)
      }).toThrowError(
        `Object returned from plugin main-file is missing required property name.`
      )
    })
  })

  describe('given a plugin object whose init function returns an object with an empty name property', () => {
    const plugin = {
      getName: () => 'main-file',
      init: jest.fn().mockReturnValue({
        name: '  ',
        extension: 'js',
        dir: '',
        role: '',
      }),
    }

    it('should throw a TypeError indicating empty name prop', () => {
      expect.assertions(1)
      expect(() => {
        validateFilePlugin(plugin)
      }).toThrowError(
        `Property name of plugin main-file cannot be an empty string.`
      )
    })
  })

  describe('given a plugin object whose init function returns an object with wrong type for name property', () => {
    const plugin = {
      getName: () => 'main-file',
      init: jest.fn().mockReturnValue({
        name: 2,
        extension: 'js',
        dir: '',
        role: '',
      }),
    }

    it('should throw an Error indicating wrong type for dir prop', () => {
      expect.assertions(1)
      expect(() => {
        validateFilePlugin(plugin)
      }).toThrowError(`Property name of plugin main-file is not a string.`)
    })
  })
})
