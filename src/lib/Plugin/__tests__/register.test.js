import registerPlugins from "../register"

describe("registerPlugins", () => {
  const defaultPlugins = ["main-file", "index-file", "stylesheet-file"]

  describe("given a global configuration with no plugins added", () => {
    const config = {}

    it("should return an array with only the names of the default plugins", () => {
      expect(registerPlugins(config)).toEqual(defaultPlugins)
    })
  })
  describe("given a global configuration with one plugin added", () => {
    const config = {
      plugins: ["actions-file"]
    }

    it("should return an array with the default plugins plus the additional plugin", () => {
      expect(registerPlugins(config)).toEqual([
        ...defaultPlugins,
        "actions-file"
      ])
    })
  })
})
