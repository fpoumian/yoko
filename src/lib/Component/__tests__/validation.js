import { validateComponentOptions, validateComponentPath } from "../validation"

describe("validateComponentOptions", () => {
  it("should throw error when options is not an object", () => {
    const options = []

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(
      "You must pass an object as the options argument. Array received instead."
    )
  })

  it("should throw error when container option is not a boolean", () => {
    const options = {
      container: "false"
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(
      "You must pass a boolean as a value for container in the component options object. String received instead."
    )
  })

  it("should throw error when main option is not a boolean", () => {
    const options = {
      main: 1
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(
      "You must pass a boolean as a value for main in the component options object. Number received instead."
    )
  })

  it("should throw error when index option is not a boolean", () => {
    const options = {
      index: []
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(
      "You must pass a boolean as a value for index in the component options object. Array received instead."
    )
  })

  it("should throw error when stylesheet option is not a boolean", () => {
    const options = {
      stylesheet: {}
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(
      "You must pass a boolean as a value for stylesheet in the component options object. Object received instead."
    )
  })

  it("should throw error when tests option is not a boolean", () => {
    const options = {
      tests: 0
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(
      "You must pass a boolean as a value for tests in the component options object. Number received instead."
    )
  })

  it("should throw error when type option is not a string", () => {
    const options = {
      type: []
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(
      "You must pass a string as a value for type in the component options object. Array received instead."
    )
  })
})

describe("validateComponentPath", () => {
  it("should throw TypeError when component path is not a string", () => {
    const path = 1
    expect(() => {
      validateComponentPath(path)
    }).toThrowError(
      `You must pass a string as a value for the componentName argument. Number received instead.`
    )
  })

  it("should throw when component path is an empty string", () => {
    const path = ""
    expect(() => {
      validateComponentPath(path)
    }).toThrowError(`The componentName argument cannot be an empty string.`)
  })

  it("should throw error when component path contains invalid characters", () => {
    expect(() => {
      validateComponentPath("Parent?/")
    }).toThrowError(
      "The componentName argument contains an invalid character. Please remove it and try again."
    )
    expect(() => {
      validateComponentPath("Parent/*.js")
    }).toThrowError(
      "The componentName argument contains an invalid character. Please remove it and try again."
    )
    expect(() => {
      validateComponentPath("<Parent/")
    }).toThrowError(
      "The componentName argument contains an invalid character. Please remove it and try again."
    )
    expect(() => {
      validateComponentPath("|Parent/")
    }).toThrowError(
      "The componentName argument contains an invalid character. Please remove it and try again."
    )
  })

  describe("When the OS is Windows", () => {
    beforeEach(() => {
      process.platform = "win32"
    })

    it("should throw error when component path contains a reserved word", () => {
      expect(() => {
        validateComponentPath("aux")
      }).toThrowError(
        "The componentName argument you passed contains a reserved character. Please remove it and try again."
      )
    })
  })
})
