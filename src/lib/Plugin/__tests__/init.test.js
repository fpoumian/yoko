import path from "path"

import makeInitPlugins from "../init"

describe("initializePlugins", () => {
  let emitter
  let initPlugins

  beforeEach(() => {
    emitter = {
      emit: jest.fn()
    }
    initPlugins = makeInitPlugins(emitter)
  })

  describe("given a set of correct plugins", () => {
    const plugins = [
      {
        getName: jest.fn().mockReturnValue("main-file"),
        getPath: jest.fn().mockReturnValue(path.resolve(__dirname)),
        init: jest.fn().mockImplementation(() => ({
          name: "ComponentName",
          extension: "js",
          dir: path.resolve(__dirname),
          role: "index",
          template: "StatelessFunctionalComponent.js"
        }))
      },
      {
        getName: jest.fn().mockReturnValue("index-file"),
        getPath: jest.fn().mockReturnValue(path.resolve(__dirname)),
        init: jest.fn().mockImplementation(() => ({
          name: "index",
          extension: "js",
          dir: path.resolve(__dirname),
          role: "index",
          template: "IndexFile.js"
        }))
      }
    ]

    const expected = [
      {
        name: "main-file",
        path: path.resolve(__dirname),
        fileProps: {
          name: "ComponentName",
          extension: "js",
          dir: path.resolve(__dirname),
          role: "index",
          template: "StatelessFunctionalComponent.js"
        }
      },
      {
        name: "index-file",
        path: path.resolve(__dirname),
        fileProps: {
          name: "index",
          extension: "js",
          dir: path.resolve(__dirname),
          role: "index",
          template: "IndexFile.js"
        }
      }
    ]

    it("should correctly initialize all plugins by returning array of component file objects", () => {
      expect(initPlugins(plugins)).toEqual(expected)
    })
  })

  describe("given a set of one correct plugin and one invalid plugin (missing name prop)", () => {
    const plugins = [
      {
        getName: jest.fn().mockReturnValue("main-file"),
        getPath: jest.fn().mockReturnValue(path.resolve(__dirname)),
        init: jest.fn().mockImplementation(() => ({
          name: "ComponentName",
          extension: "js",
          dir: path.resolve(__dirname),
          role: "index",
          template: "StatelessFunctionalComponent.js"
        }))
      },
      {
        getName: jest.fn().mockReturnValue("index-file"),
        getPath: jest.fn().mockReturnValue(path.resolve(__dirname)),
        init: jest.fn().mockImplementation(() => ({
          extension: "js",
          dir: path.resolve(__dirname),
          role: "index",
          template: "IndexFile.js"
        }))
      }
    ]

    it("should register the correct plugin", () => {
      const registered = initPlugins(plugins)
      expect(registered).toHaveLength(1)
      expect(registered).toEqual([
        {
          name: "main-file",
          path: path.resolve(__dirname),
          fileProps: {
            name: "ComponentName",
            extension: "js",
            dir: path.resolve(__dirname),
            role: "index",
            template: "StatelessFunctionalComponent.js"
          }
        }
      ])
    })
    it("should call the emitter emit method with an error argument", () => {
      initPlugins(plugins)
      expect(emitter.emit.mock.calls[0][0]).toBe("error")
      expect(emitter.emit.mock.calls[0][1]).toContain(
        "Cannot initialize plugin"
      )
      expect(emitter.emit.mock.calls[0][1]).toContain("index-file")
    })
  })
})