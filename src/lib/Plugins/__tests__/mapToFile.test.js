import mapToFiles from "../mapToFiles"

describe("mapToFiles", () => {
  let plugins

  describe("given that all plugins export a default function", () => {
    beforeEach(() => {
      plugins = [
        jest.fn().mockImplementation(() => () => {}),
        jest.fn().mockImplementation(() => () => {})
      ]
    })

    it("should return an array of functions", () => {})
  })
})
