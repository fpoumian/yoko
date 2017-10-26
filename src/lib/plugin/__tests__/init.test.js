import path from 'path'

import makeInitPlugins from '../init'

xdescribe('initializePlugins', () => {
  let emitter
  let initPlugins

  beforeEach(() => {
    emitter = {
      emit: jest.fn(),
    }
    initPlugins = makeInitPlugins(emitter)
  })

  describe('given a set of correct plugins', () => {
    const plugins = [
      {
        name: jest.fn().mockReturnValue('main-file'),
        path: jest.fn().mockReturnValue(path.resolve(__dirname)),
        init: jest.fn().mockReturnValue({
          name: 'ComponentName',
          extension: 'js',
          dir: path.resolve(__dirname),
          role: 'index',
          template: {
            name: 'stateless-functional-component.js',
            dir: path.resolve(__dirname, 'templates'),
            context: {},
          },
        }),
      },
      {
        name: jest.fn().mockReturnValue('index-file'),
        path: jest.fn().mockReturnValue(path.resolve(__dirname)),
        init: jest.fn().mockReturnValue({
          name: 'index',
          extension: 'js',
          dir: path.resolve(__dirname),
          role: 'index',
          template: {
            name: 'index-file.js',
            dir: path.resolve(__dirname, 'templates'),
            context: {},
          },
        }),
      },
    ]

    const expected = [
      {
        name: 'main-file',
        path: path.resolve(__dirname),
        fileProps: {
          name: 'ComponentName',
          extension: 'js',
          dir: path.resolve(__dirname),
          role: 'index',
          template: {
            name: 'stateless-functional-component.js',
            dir: path.resolve(__dirname, 'templates'),
            context: {},
          },
        },
      },
      {
        name: 'index-file',
        path: path.resolve(__dirname),
        fileProps: {
          name: 'index',
          extension: 'js',
          dir: path.resolve(__dirname),
          role: 'index',
          template: {
            name: 'index-file.js',
            dir: path.resolve(__dirname, 'templates'),
            context: {},
          },
        },
      },
    ]

    it('should correctly initialize all plugins by returning array of component file objects', () => {
      expect(initPlugins(plugins)).toEqual(expected)
    })
  })

  describe('given a set of one correct plugin and one invalid plugin (missing name prop)', () => {
    const plugins = [
      {
        name: jest.fn().mockReturnValue('main-file'),
        path: jest.fn().mockReturnValue(path.resolve(__dirname)),
        init: jest.fn().mockImplementation(() => ({
          name: 'ComponentName',
          extension: 'js',
          dir: path.resolve(__dirname),
          role: 'index',
          template: {
            name: 'stateless-functional-component.js',
            dir: path.resolve(__dirname, 'templates'),
          },
        })),
      },
      {
        name: jest.fn().mockReturnValue('index-file'),
        path: jest.fn().mockReturnValue(path.resolve(__dirname)),
        init: jest.fn().mockImplementation(() => ({
          extension: 'js',
          dir: path.resolve(__dirname),
          role: 'index',
          template: {
            name: 'index-file.js',
            dir: path.resolve(__dirname, 'templates'),
          },
        })),
      },
    ]

    it('should register the correct plugin', () => {
      const registered = initPlugins(plugins)
      expect(registered).toHaveLength(1)
      expect(registered).toEqual([
        {
          name: 'main-file',
          path: path.resolve(__dirname),
          fileProps: {
            name: 'ComponentName',
            extension: 'js',
            dir: path.resolve(__dirname),
            role: 'index',
            template: {
              name: 'stateless-functional-component.js',
              dir: path.resolve(__dirname, 'templates'),
            },
          },
        },
      ])
    })
    it('should call the emitter emit method with an error argument', () => {
      initPlugins(plugins)
      expect(emitter.emit.mock.calls[0][0]).toBe('error')
    })
  })

  describe('given a set of one correct plugin and one plugin whose skip value is set to true', () => {
    const plugins = [
      {
        name: jest.fn().mockReturnValue('main-file'),
        path: jest.fn().mockReturnValue(path.resolve(__dirname)),
        init: jest.fn().mockImplementation(() => ({
          name: 'ComponentName',
          extension: 'js',
          dir: path.resolve(__dirname),
          role: 'main',
          template: {
            name: 'stateless-functional-component.js',
            dir: path.resolve(__dirname, 'templates'),
          },
        })),
      },
      {
        name: jest.fn().mockReturnValue('index-file'),
        path: jest.fn().mockReturnValue(path.resolve(__dirname)),
        init: jest.fn().mockImplementation(() => ({
          name: 'index',
          extension: 'js',
          dir: path.resolve(__dirname),
          role: 'index',
          skip: true,
          template: {
            name: 'index-file.js',
            dir: path.resolve(__dirname, 'templates'),
          },
        })),
      },
    ]

    it('should register the correct plugin', () => {
      const registered = initPlugins(plugins)
      expect(registered).toHaveLength(1)
      expect(registered).toEqual([
        {
          name: 'main-file',
          path: path.resolve(__dirname),
          fileProps: {
            name: 'ComponentName',
            extension: 'js',
            dir: path.resolve(__dirname),
            role: 'main',
            template: {
              name: 'stateless-functional-component.js',
              dir: path.resolve(__dirname, 'templates'),
            },
          },
        },
      ])
    })
    it('should call the emitter emit method with a warn argument', () => {
      initPlugins(plugins)
      expect(emitter.emit.mock.calls[0][0]).toBe('warn')
    })
  })
})
