import path from "path"
import { find } from "lodash"

import write from "../write"

describe("write", () => {
  let getRole
  let component
  let emitter
  let writeFile
  let writeComponentFiles
  let file
  let fileList

  describe("given a valid component", () => {
    beforeEach(() => {
      emitter = {
        emit: jest.fn()
      }
      getRole = jest.fn().mockReturnValueOnce("main").mockReturnValue("index")
      file = {
        getName: jest.fn(),
        getPath: jest.fn(),
        getTemplatePath: jest.fn(),
        getExtension: jest.fn(),
        getRole
      }

      fileList = new Map()
      fileList.set("main", file)
      fileList.set("index", file)

      component = {
        getName: jest.fn(),
        getPath: jest.fn(),
        getEmitter() {
          return emitter
        },
        getFiles() {
          return fileList
        }
      }

      writeFile = jest
        .fn()
        .mockReturnValueOnce(
          Promise.resolve(path.resolve(process.cwd(), "TestComponent.js"))
        )
        .mockReturnValue(
          Promise.resolve(path.resolve(process.cwd(), "index.js"))
        )
      writeComponentFiles = write(writeFile)
    })

    it("should call the writeFile function as many times as there are files to write", () =>
      writeComponentFiles(component).then(() => {
        expect(writeFile).toHaveBeenCalledTimes(fileList.size)
      }))

    it("should return a Promise", () => {
      expect(writeComponentFiles(component)).toBeInstanceOf(Promise)
    })

    it("should return a Promise which resolves into an array of objects", () => {
      expect.assertions(3)
      return writeComponentFiles(component).then(result => {
        expect(result).toHaveLength(2)
        expect(result[0]).toBeInstanceOf(Object)
        expect(result[1]).toBeInstanceOf(Object)
      })
    })

    it("should return a Promise which resolves into an array of Paths objects with the correct file roles", () => {
      expect.assertions(2)
      return writeComponentFiles(component).then(paths => {
        expect(find(paths, o => o.main)).toEqual({
          main: path.resolve(process.cwd(), "TestComponent.js")
        })
        expect(find(paths, o => o.index)).toEqual({
          index: path.resolve(process.cwd(), "index.js")
        })
      })
    })

    it("should call the component emitter emit method as many times as files in the list (multiplied by two)", () => {
      expect.assertions(1)
      return writeComponentFiles(component).then(() => {
        expect(emitter.emit).toHaveBeenCalledTimes(fileList.size * 2)
      })
    })

    it("should call the component getName() method as many times as files in the list", () => {
      expect.assertions(1)
      return writeComponentFiles(component).then(() => {
        expect(component.getName).toHaveBeenCalledTimes(fileList.size)
      })
    })

    it("should call the file getRole() method as many times as files in the list", () => {
      expect.assertions(1)
      return writeComponentFiles(component).then(() => {
        expect(file.getRole).toHaveBeenCalledTimes(fileList.size)
      })
    })

    it("should call the file getTemplatePath() method as many times as files in the list", () => {
      expect.assertions(1)
      return writeComponentFiles(component).then(() => {
        expect(file.getTemplatePath).toHaveBeenCalledTimes(fileList.size)
      })
    })

    it("should call the component emitter fileWritten event with the correct file path as an argument", () => {
      expect.assertions(3)
      return writeComponentFiles(component).then(() => {
        expect(emitter.emit).toHaveBeenCalledWith(
          "mainFileWritten",
          path.resolve(process.cwd(), "TestComponent.js")
        )
        expect(emitter.emit).toHaveBeenLastCalledWith(
          "indexFileWritten",
          path.resolve(process.cwd(), "index.js")
        )
        expect(emitter.emit).toHaveBeenCalledTimes(fileList.size * 2)
      })
    })
  })
})
