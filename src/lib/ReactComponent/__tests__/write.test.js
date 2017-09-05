import write from "../write"
import createReactComponent from "../factory"
import path from "path"
import { find } from "lodash"

describe("write", () => {
  let getRole
  let createComponentFile
  let component
  let writeFile
  let writeComponentFiles

  describe("given a valid component", () => {
    beforeEach(() => {
      getRole = jest.fn().mockReturnValueOnce("main").mockReturnValue("index")
      createComponentFile = () => ({
        getName: jest.fn(),
        getPath: jest.fn(),
        getTemplatePath: jest.fn(),
        getExtension: jest.fn(),
        getRole: getRole
      })

      component = createReactComponent(createComponentFile)({ index: true }, {})

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

    it("should call thr writeFile function that is passed as parameter", () => {
      return writeComponentFiles(component).then(() => {
        expect(writeFile).toHaveBeenCalled()
      })
    })

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

    it("should return a Promise which resolves into an array of Paths objects", () => {
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
  })
})
