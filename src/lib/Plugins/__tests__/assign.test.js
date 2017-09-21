import assignPlugins from "../assign"

describe("assignPlugins", () => {
  describe("given an empty array of plugins", () => {
    it("should return an array with only the default main-file-plugin", () => {
      const result = assignPlugins([], { main: true })
      expect(result).toEqual(["main-file"])
    })
  })
})
