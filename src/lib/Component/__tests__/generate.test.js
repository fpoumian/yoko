import path from 'path'
import find from 'lodash/find'

import makeGenerateComponent from '../generate'

describe('generateComponent', () => {
  let getRole
  let getPath
  let component
  let generateComponent
  let file
  let fileList
  let fs
  let formatter
  let config
  let templateCompiler

  describe('given a valid component', () => {
    beforeEach(() => {
      getRole = jest
        .fn()
        .mockReturnValueOnce('main')
        .mockReturnValue('index')
      getPath = jest
        .fn()
        .mockReturnValue(path.resolve(__dirname, 'Component.js'))
        .mockReturnValue(path.resolve(__dirname, 'index.js'))

      file = {
        getName: jest.fn(),
        getPath,
        getTemplate: () => ({ getPath: () => '', getContext: () => {} }),
        getExtension: jest.fn(),
        getRole,
      }

      fileList = new Map()
      fileList.set('main', file)
      fileList.set('index', file)

      component = {
        getName: jest.fn(),
        getPath: jest.fn(),
        getFiles() {
          return fileList
        },
      }

      fs = {
        ensureFile: jest.fn().mockReturnValue(Promise.resolve()),
        removeComponentRootDir: jest
          .fn()
          .mockImplementation((component, config) =>
            Promise.resolve(component)
          ),
        createComponentRootDir: jest
          .fn()
          .mockImplementation(component => Promise.resolve(component)),
      }

      fs.writeComponentFile = jest
        .fn()
        .mockReturnValueOnce(
          Promise.resolve(path.resolve(process.cwd(), 'TestComponent.js'))
        )
        .mockReturnValue(
          Promise.resolve(path.resolve(process.cwd(), 'index.js'))
        )

      formatter = {
        format: jest.fn().mockReturnValue(''),
      }

      config = {
        formatting: {
          prettier: true,
        },
      }

      templateCompiler = {
        compile: jest.fn().mockReturnValue({
          render: jest.fn().mockReturnValue(''),
        }),
      }

      generateComponent = makeGenerateComponent(fs, templateCompiler, formatter)
    })

    it('should call the removeComponentRootDir method one time only', () => {
      expect.assertions(1)
      return generateComponent(component, config).then(() => {
        expect(fs.removeComponentRootDir).toHaveBeenCalledTimes(1)
      })
    })

    it('should call the createComponentRootDir method one time only', () => {
      expect.assertions(1)
      return generateComponent(component, config).then(() => {
        expect(fs.createComponentRootDir).toHaveBeenCalledTimes(1)
      })
    })

    it('should call the writeComponentFile method as many times as there are files to write', () => {
      expect.assertions(1)
      return generateComponent(component, config).then(() => {
        expect(fs.writeComponentFile).toHaveBeenCalledTimes(fileList.size)
      })
    })

    it('should call the formatter.format method as many times as there are files to write', () => {
      expect.assertions(1)
      return generateComponent(component, config).then(() => {
        expect(formatter.format).toHaveBeenCalledTimes(fileList.size)
      })
    })

    it('should call the formatter.format method with only the code string as only argument', () => {
      expect.assertions(1)
      return generateComponent(component, config).then(() => {
        expect(formatter.format).toHaveBeenCalledWith('')
      })
    })

    describe('when the global config object contains a custom prettier configuration', () => {
      beforeEach(() => {
        config = {
          formatting: {
            prettier: {
              semi: false,
              singleQuote: true,
            },
          },
        }
      })
      it('should call the formatter.format method with both the code string and the custom configuration as arguments', () => {
        expect.assertions(1)
        return generateComponent(component, config).then(() => {
          expect(formatter.format).toHaveBeenCalledWith(
            '',
            config.formatting.prettier
          )
        })
      })
    })

    it('should return a Promise which resolves into an array of Paths objects with the correct file roles', () => {
      expect.assertions(2)
      return generateComponent(component, config).then(paths => {
        expect(find(paths, o => o.main)).toEqual({
          main: path.resolve(process.cwd(), 'TestComponent.js'),
        })
        expect(find(paths, o => o.index)).toEqual({
          index: path.resolve(process.cwd(), 'index.js'),
        })
      })
    })
  })
})
