import path from "path"

import makeInitPlugins from "../init"

describe("initializePlugins", () => {
  let emitter
  let initPlugins

  beforeEach(() => {
    emitter = {
      emit: jest.fn()
    }
    initPlugins = makeInitPlugins()
  })

  describe("given a set of correct plugins", () => {
    const plugins = [
      {
        name: "main-file",
        path: path.resolve(__dirname),
        init: jest.fn().mockImplementation(() => ({
          name: "ComponentName",
          extension: "js",
          dir: path.resolve(__dirname),
          role: "index",
          template: "StatelessFunctionalComponent.js"
        }))
      },
      {
        name: "index-file",
        path: path.resolve(__dirname),
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
    xit(
      "should call the emitter emit method once with registered plugins as argument",
      () => {
        initPlugins(plugins)
        expect(emitter.emit).toHaveBeenCalledTimes(1)
        expect(emitter.emit).toHaveBeenLastCalledWith(
          "pluginsInitialized",
          expected
        )
      }
    )
  })

  describe("given a set of one correct plugin and one invalid plugin (missing name prop)", () => {
    const plugins = [
      {
        name: "main-file",
        path: path.resolve(__dirname),
        init: jest.fn().mockImplementation(() => ({
          name: "ComponentName",
          extension: "js",
          dir: path.resolve(__dirname),
          role: "index",
          template: "StatelessFunctionalComponent.js"
        }))
      },
      {
        name: "index-file",
        path: path.resolve(__dirname),
        init: jest.fn().mockImplementation(() => ({
          extension: "js",
          dir: path.resolve(__dirname),
          role: "index",
          template: "IndexFile.js"
        }))
      }
    ]

    xit("should register the correct plugin", () => {
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
    xit("should call the emitter emit method twice", () => {
      initPlugins(plugins)
      expect(emitter.emit).toHaveBeenCalledTimes(2)
    })
    xit("should call the emitter emit method with an error argument", () => {
      initPlugins(plugins)
      expect(emitter.emit.mock.calls[0][[1]]).toBeInstanceOf(Error)
    })
  })
})
