import path from "path"
import makeInitGenerator from "../init"
import constants from "../../Plugins/constants"

describe("init", () => {
  let config

  const emitter = {
    emit: jest.fn()
  }

  const pluginPrefix = constants.PLUGIN_PREFIX

  const resolvedPlugins = [
    {
      name: "index-file",
      path: path.resolve(
        __dirname,
        "node_modules",
        `${pluginPrefix}-index-file`
      )
    },
    {
      name: "main-file",
      path: path.resolve(__dirname, "node_modules", `${pluginPrefix}-main-file`)
    },
    {
      name: "stylesheet-file",
      path: path.resolve(
        __dirname,
        "node_modules",
        `${pluginPrefix}-stylesheet-file`
      )
    }
  ]
  const resolveFn = jest.fn().mockReturnValue([...resolvedPlugins])

  const loadFn = jest.fn()

  const initGenerator = makeInitGenerator(emitter, resolveFn, loadFn)

  describe("given a configuration object with one uninstalled plugin", () => {
    beforeEach(() => {
      config = {
        plugins: ["tests-file"]
      }
    })

    it("should emit events four times", () => {
      initGenerator(config)
      expect(emitter.emit).toHaveBeenCalledTimes(4)
    })

    it("should emit pluginsRegistered event with an array of all registered plugins", () => {
      initGenerator(config)
      expect(emitter.emit).toHaveBeenCalledWith("pluginsRegistered", [
        "main-file",
        "index-file",
        "stylesheet-file",
        "tests-file"
      ])
    })

    it("should emit pluginsResolved event with an array of resolve plugins objects", () => {
      initGenerator(config)
      expect(emitter.emit).toHaveBeenCalledWith("pluginsResolved", [
        ...resolvedPlugins
      ])
    })

    it("should emit error event with missing plugin as an argument", () => {
      initGenerator(config)
      expect(emitter.emit).toHaveBeenCalledWith(
        "error",
        `Unable to find plugin tests-file. Are you sure it's installed?`
      )
    })
  })
})
