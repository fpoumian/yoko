import path from "path"

import makeWriteComponentFile from "../write"

describe("write", () => {
  let getRole
  let getPath
  let writeComponentFile
  let file
  let fs

  describe("given a valid file", () => {
    beforeEach(() => {
      getRole = jest.fn().mockReturnValueOnce("main").mockReturnValue("index")
      getPath = jest
        .fn()
        .mockReturnValue(path.resolve(process.cwd(), "TestComponent.js"))
        .mockReturnValue(path.resolve(process.cwd(), "index.js"))

      file = {
        getName: jest.fn(),
        getPath,
        getTemplate: jest.fn(),
        getExtension: jest.fn(),
        getRole
      }

      fs = {
        ensureFile: jest.fn().mockReturnValue(Promise.resolve()),
        writeFile: jest
          .fn()
          .mockReturnValueOnce(
            Promise.resolve(path.resolve(process.cwd(), "TestComponent.js"))
          )
          .mockReturnValue(
            Promise.resolve(path.resolve(process.cwd(), "index.js"))
          )
      }
      writeComponentFile = makeWriteComponentFile(fs)
    })

    it("should call the writeFile method one time", () => {
      expect.assertions(1)
      return writeComponentFile(file, "").then(() => {
        expect(fs.writeFile).toHaveBeenCalledTimes(1)
      })
    })

    it("should call the writeFile method with correct set of arguments", () => {
      expect.assertions(1)
      return writeComponentFile(file, "").then(() => {
        expect(fs.writeFile).toHaveBeenCalledWith(file.getPath(), "", "utf8")
      })
    })

    it("should call the ensureFile method one time", () => {
      expect.assertions(1)
      return writeComponentFile(file, "").then(() => {
        expect(fs.ensureFile).toHaveBeenCalledTimes(1)
      })
    })

    it("should call the ensureFile method with correct set of arguments", () => {
      expect.assertions(1)
      return writeComponentFile(file, "").then(() => {
        expect(fs.ensureFile).toHaveBeenCalledWith(file.getPath())
      })
    })

    it("should call the file.getPath method three times", () => {
      expect.assertions(1)
      return writeComponentFile(file, "").then(() => {
        expect(file.getPath).toHaveBeenCalledTimes(3)
      })
    })
  })
})
