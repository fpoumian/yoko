import makeInitGenerator from '../init'

describe('init', () => {
  let config
  let emitter
  let loadFn
  let initGenerator

  const loadedPlugins = [
    {
      getName: () => 'index-file',
    },
    {
      getName: () => 'main-file',
    },
    {
      getName: () => 'stylesheet-file',
    },
  ]

  describe('given a configuration object with one uninstalled plugin', () => {
    beforeEach(() => {
      config = {
        plugins: ['tests-file'],
      }
      emitter = {
        emit: jest.fn(),
      }
      loadFn = jest.fn().mockReturnValue([...loadedPlugins])
      initGenerator = makeInitGenerator(emitter, loadFn)
    })

    it('should emit initGenerator event', () => {
      initGenerator(config)
      expect(emitter.emit).toHaveBeenCalledWith('initGenerator')
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
      expect(emitter.emit).toHaveBeenCalledWith('pluginsLoaded', [
        'index-file',
        'main-file',
        'stylesheet-file',
      ])
    })
  })
})
