import { find } from "lodash"
import path from "path"

import makeLoadPlugins from "../load"

describe("load", () => {
  let loadPlugins
  let loader
  let emitter

  beforeEach(() => {
    emitter = {
      emit: jest.fn()
    }
  })

  const plugins = [
    {
      name: "main-file",
      path: path.resolve(__dirname)
    },
    {
      name: "index-file",
      path: path.resolve(__dirname)
    }
  ]

  describe("given that all the plugins exist", () => {
    beforeEach(() => {
      loader = {
        require: jest.fn().mockReturnValue(() => function() {})
      }
      loadPlugins = makeLoadPlugins(loader, emitter)
    })

    it("should return an array with a length equal to the amount of plugins found", () => {
      const loadedPlugins = loadPlugins(plugins)
      expect(loadedPlugins).toBeInstanceOf(Array)
      expect(loadedPlugins).toHaveLength(plugins.length)
    })
    it("should return an array of objects with name, path and init properties", () => {
      const loadedPlugins = loadPlugins(plugins)
      const mainFile = find(loadedPlugins, obj => obj.name === "main-file")
      const indexFile = find(loadedPlugins, obj => obj.name === "index-file")
      expect(mainFile.name).toEqual("main-file")
      expect(mainFile.path).toEqual(path.resolve(__dirname))
      expect(mainFile.init).toBeInstanceOf(Function)
      expect(indexFile.name).toEqual("index-file")
      expect(indexFile.path).toEqual(path.resolve(__dirname))
      expect(indexFile.init).toBeInstanceOf(Function)
    })
  })
  describe("given that one plugin is not found", () => {
    beforeEach(() => {
      loader = {
        require: jest
          .fn()
          // this will be the main-file plugin
          .mockImplementationOnce(() => function() {})
          // this will be the index-file plugin
          .mockImplementationOnce(() => {
            throw new Error("mockImplementationError")
          })
      }
      loadPlugins = makeLoadPlugins(loader, emitter)
    })

    it("should return an array that excludes not loaded plugins", () => {
      const loadedPlugins = loadPlugins(plugins)
      expect(loadedPlugins).toHaveLength(1)
    })

    it("should call the emitter.emit method with an error argument", () => {
      loadPlugins(plugins)
      expect(emitter.emit).toHaveBeenCalledWith(
        "error",
        "Cannot load plugin index-file."
      )
    })
  })
})
