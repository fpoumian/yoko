import { find } from "lodash"
import path from "path"

import makeResolvePlugins from "../resolve"

describe("load", () => {
  let resolvePlugins
  let loader
  let emitter

  beforeEach(() => {
    emitter = {
      emit: jest.fn()
    }
  })

  describe("given that all the plugins exist", () => {
    beforeEach(() => {
      loader = {
        resolve: jest.fn().mockReturnValue(path.resolve(__dirname))
      }
      resolvePlugins = makeResolvePlugins(loader, emitter)
    })

    it("should return an array with all the plugins", () => {
      const names = ["main-file", "index-file"]
      const plugins = resolvePlugins(names)
      expect(plugins).toBeInstanceOf(Array)
      expect(plugins).toHaveLength(names.length)
    })
    it("should return an array of objects with name and path properties", () => {
      const names = ["main-file", "index-file"]
      const plugins = resolvePlugins(names)
      const mainFile = find(plugins, obj => obj.name === "main-file")
      const indexFile = find(plugins, obj => obj.name === "index-file")
      expect(mainFile.name).toEqual("main-file")
      expect(mainFile.path).toEqual(path.resolve(__dirname))
      expect(indexFile.name).toEqual("index-file")
      expect(indexFile.path).toEqual(path.resolve(__dirname))
    })
  })
  xdescribe("given that one plugin is not found", () => {
    beforeEach(() => {
      loader = {
        resolve: jest
          .fn()
          // this will be the main-file plugin
          .mockImplementationOnce(() => path.resolve(__dirname))
          // this will be the index-file plugin
          .mockImplementationOnce(() => {
            throw new Error()
          })
      }
      resolvePlugins = makeResolvePlugins(loader, emitter)
    })

    xit("should return an array that excludes not found plugins", () => {
      const names = ["main-file", "index-file"]
      const plugins = resolvePlugins(names)
      expect(plugins).toHaveLength(1)
    })

    xit("should call the emitter.emit method with an error argument", () => {
      const names = ["main-file", "index-file"]
      resolvePlugins(names)
      expect(emitter.emit).toHaveBeenCalledWith(
        "error",
        "Cannot find plugin index-file."
      )
    })
  })
})
