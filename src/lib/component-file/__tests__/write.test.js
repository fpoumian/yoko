import pathNode from 'path'

import makeWriteComponentFile from '../write'

describe('write', () => {
  let getRole
  let path
  let writeComponentFile
  let file
  let fs

  describe('given a valid file', () => {
    beforeEach(() => {
      getRole = jest
        .fn()
        .mockReturnValueOnce('main')
        .mockReturnValue('index')
      path = jest
        .fn()
        .mockReturnValue(pathNode.resolve(process.cwd(), 'TestComponent.js'))
        .mockReturnValue(pathNode.resolve(process.cwd(), 'index.js'))

      file = {
        getName: jest.fn(),
        path,
        getTemplate: jest.fn(),
        getExtension: jest.fn(),
        getRole,
      }

      fs = {
        ensureFile: jest.fn().mockReturnValue(Promise.resolve()),
        writeFile: jest
          .fn()
          .mockReturnValueOnce(
            Promise.resolve(pathNode.resolve(process.cwd(), 'TestComponent.js'))
          )
          .mockReturnValue(
            Promise.resolve(pathNode.resolve(process.cwd(), 'index.js'))
          ),
      }
      writeComponentFile = makeWriteComponentFile(fs)
    })

    it('should call the writeFile method one time', () => {
      expect.assertions(1)
      return writeComponentFile(file, '').then(() => {
        expect(fs.writeFile).toHaveBeenCalledTimes(1)
      })
    })

    it('should call the writeFile method with correct set of arguments', () => {
      expect.assertions(1)
      return writeComponentFile(file, '').then(() => {
        expect(fs.writeFile).toHaveBeenCalledWith(file.path(), '', 'utf8')
      })
    })

    it('should call the ensureFile method one time', () => {
      expect.assertions(1)
      return writeComponentFile(file, '').then(() => {
        expect(fs.ensureFile).toHaveBeenCalledTimes(1)
      })
    })

    it('should call the ensureFile method with correct set of arguments', () => {
      expect.assertions(1)
      return writeComponentFile(file, '').then(() => {
        expect(fs.ensureFile).toHaveBeenCalledWith(file.path())
      })
    })

    it('should call the file.path method three times', () => {
      expect.assertions(1)
      return writeComponentFile(file, '').then(() => {
        expect(file.path).toHaveBeenCalledTimes(3)
      })
    })
  })
})
