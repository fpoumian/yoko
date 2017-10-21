import nunjucks from 'nunjucks'
import path from 'path'
import find from 'lodash/find'

import write from '../write'

describe('write', () => {
  let getRole
  let getPath
  let component
  let emitter
  let writeComponentFiles
  let file
  let fileList
  let fs
  let formatter
  let config
  let templateCompiler

  describe('given a valid component', () => {
    beforeEach(() => {
      emitter = {
        emit: jest.fn(),
      }
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
        getTemplate: jest
          .fn()
          .mockReturnValue({ getPath: () => '', getContext: () => {} }),
        hasTemplate: jest.fn().mockReturnValue(true),
        getExtension: jest.fn(),
        getRole,
      }

      fileList = new Map()
      fileList.set('main', file)
      fileList.set('index', file)

      component = {
        getName: jest.fn(),
        getPath: jest.fn(),
        getEmitter() {
          return emitter
        },
        getFiles() {
          return fileList
        },
      }

      fs = {
        ensureFile: jest.fn().mockReturnValue(Promise.resolve()),
      }

      fs.writeFile = jest
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

      writeComponentFiles = write(fs, templateCompiler, formatter)
    })

    it('should call the writeFile method as many times as there are files to write', () => {
      expect.assertions(1)
      return writeComponentFiles(component, config).then(() => {
        expect(fs.writeFile).toHaveBeenCalledTimes(fileList.size)
      })
    })

    it('should call the formatter.format method as many times as there are files to write', () => {
      expect.assertions(1)
      return writeComponentFiles(component, config).then(() => {
        expect(formatter.format).toHaveBeenCalledTimes(fileList.size)
      })
    })

    it('should call the formatter.format method with only the code string as only argument', () => {
      expect.assertions(1)
      return writeComponentFiles(component, config).then(() => {
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
        return writeComponentFiles(component, config).then(() => {
          expect(formatter.format).toHaveBeenCalledWith(
            '',
            config.formatting.prettier
          )
        })
      })
    })

    it('should return a Promise', () => {
      expect(writeComponentFiles(component, config)).toBeInstanceOf(Promise)
    })

    it('should return a Promise which resolves into an array of objects', () => {
      expect.assertions(3)
      return writeComponentFiles(component, config).then(result => {
        expect(result).toHaveLength(2)
        expect(result[0]).toBeInstanceOf(Object)
        expect(result[1]).toBeInstanceOf(Object)
      })
    })

    xit('should return a Promise which resolves into an array of Paths objects with the correct file roles', () => {
      expect.assertions(2)
      return writeComponentFiles(component, config).then(paths => {
        expect(find(paths, o => o.main)).toEqual({
          main: path.resolve(process.cwd(), 'TestComponent.js'),
        })
        expect(find(paths, o => o.index)).toEqual({
          index: path.resolve(process.cwd(), 'index.js'),
        })
      })
    })

    xit('should call the component emitter emit method as many times as files in the list (multiplied by two)', () => {
      expect.assertions(1)
      return writeComponentFiles(component, config).then(() => {
        expect(emitter.emit).toHaveBeenCalledTimes(fileList.size * 2)
      })
    })

    xit('should call the component getName() method as many times as files in the list', () => {
      expect.assertions(1)
      return writeComponentFiles(component, config).then(() => {
        expect(component.getName).toHaveBeenCalledTimes(fileList.size)
      })
    })

    it('should call the file getRole() method as many times as files in the list', () => {
      expect.assertions(1)
      return writeComponentFiles(component, config).then(() => {
        expect(file.getRole).toHaveBeenCalledTimes(fileList.size)
      })
    })

    it('should call the file getTemplate() method as many times as files in the list', () => {
      expect.assertions(1)
      return writeComponentFiles(component, config).then(() => {
        expect(file.getTemplate).toHaveBeenCalledTimes(fileList.size)
      })
    })

    xit('should call the component emitter fileWritten event with the correct file path as an argument', () => {
      expect.assertions(3)
      return writeComponentFiles(component, config).then(() => {
        expect(emitter.emit).toHaveBeenCalledWith(
          'mainFileWritten',
          path.resolve(process.cwd(), 'TestComponent.js')
        )
        expect(emitter.emit).toHaveBeenLastCalledWith(
          'indexFileWritten',
          path.resolve(process.cwd(), 'index.js')
        )
        expect(emitter.emit).toHaveBeenCalledTimes(fileList.size * 2)
      })
    })
  })
})
