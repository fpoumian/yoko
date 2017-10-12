import path from "path"

import makeResolveDir from "../resolveDir"
import * as constants from "../constants"

xdescribe("resolveDir", () => {
  let resolveDir
  let resolverFn
  let defaultDir

  beforeEach(() => {
    defaultDir = path.resolve(__dirname)
  })

  describe("given that no custom templates path is in config", () => {
    const config = {
      paths: {
        templates: ""
      }
    }

    beforeEach(() => {
      resolverFn = jest.fn()
      resolveDir = makeResolveDir(resolverFn)
    })

    it("should return the default dir", () => {
      expect(
        resolveDir(constants.SFC_TEMPLATE_FILE_NAME, defaultDir, config)
      ).toEqual(path.resolve(__dirname))
    })
  })

  describe("given that a custom template is in config", () => {
    const config = {
      paths: {
        templates: path.resolve(__dirname, "templates")
      }
    }

    describe("given that the template exists inside the custom template dir", () => {
      beforeEach(() => {
        resolverFn = jest.fn().mockReturnValue(true)
        resolveDir = makeResolveDir(resolverFn)
      })

      it("should return the custom template dir", () => {
        expect(
          resolveDir(constants.SFC_TEMPLATE_FILE_NAME, defaultDir, config)
        ).toEqual(path.resolve(__dirname, "templates"))
      })
    })

    describe("given that the template does not exist inside the custom template dir", () => {
      beforeEach(() => {
        resolverFn = jest.fn().mockReturnValue(false)
        resolveDir = makeResolveDir(resolverFn)
      })

      it("should return the default template dir", () => {
        expect(
          resolveDir(constants.SFC_TEMPLATE_FILE_NAME, defaultDir, config)
        ).toEqual(path.resolve(__dirname))
      })
    })
  })
})
