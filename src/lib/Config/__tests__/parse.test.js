import path from "path"

import parseConfig from "../parse"

describe("given that the user did not provide any custom configuration", () => {
  const userConfig = {}

  it("should be able to return the default configuration", () => {
    expect(parseConfig(userConfig)).toEqual({
      paths: {
        components: path.resolve(process.cwd(), "components"),
        containers: path.resolve(process.cwd(), "containers"),
        templates: ""
      },
      extensions: {
        js: {
          main: "js",
          index: "js",
          tests: "test.js"
        },
        stylesheet: {
          main: "css"
        }
      },
      rules: {
        "component-name-root-dir": true
      },
      formatting: {
        prettier: true
      }
    })
  })
})

describe("given that the user provided a custom relative components path", () => {
  it("should be able to return a configuration object includes a custom components path", () => {
    const userConfig = {
      paths: {
        components: "src/components"
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty(
      "paths.components",
      path.resolve(process.cwd(), "src", "components")
    )
    expect(parseConfig(userConfig)).toHaveProperty(
      "paths.containers",
      path.resolve(process.cwd(), "containers")
    )
  })

  it("should be able to handle wrongly formatted paths", () => {
    const userConfig = {
      paths: {
        components: " ./src/components "
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty(
      "paths.components",
      path.resolve(process.cwd(), "src", "components")
    )
  })
})

describe("given that the user provided a custom absolute components path", () => {
  it("should be able to return a configuration object includes a custom components path", () => {
    const userConfig = {
      paths: {
        components: path.resolve(__dirname, "src", "components")
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty(
      "paths.components",
      path.resolve(__dirname, "src", "components")
    )
    expect(parseConfig(userConfig)).toHaveProperty(
      "paths.containers",
      path.resolve(process.cwd(), "containers")
    )
  })
})

describe("given that the user provided a custom containers path", () => {
  it("should be able to return a configuration object that includes a custom containers path", () => {
    const userConfig = {
      paths: {
        containers: "../src/containers"
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty(
      "paths.containers",
      path.resolve(process.cwd(), "..", "src", "containers")
    )
  })
})

describe("given that the user provided a custom JS extension", () => {
  it("should be able to return a configuration object includes a custom JS main extension", () => {
    const userConfig = {
      extensions: {
        js: {
          main: "jsx"
        }
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty("extensions.js", {
      main: "jsx",
      index: "js",
      tests: "test.js"
    })
  })

  it("should be able to return a configuration object that includes a custom JS index extension", () => {
    const userConfig = {
      extensions: {
        js: {
          index: "ts"
        }
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty("extensions.js", {
      main: "js",
      index: "ts",
      tests: "test.js"
    })
  })

  it("should be able to return a configuration object that includes a custom JS index extension", () => {
    const userConfig = {
      extensions: {
        js: {
          index: "ts"
        }
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty("extensions.js", {
      main: "js",
      index: "ts",
      tests: "test.js"
    })
  })

  it("should be able to normalize extensions with extra spaces", () => {
    const userConfig = {
      extensions: {
        js: {
          index: "ts "
        }
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty("extensions.js.index", "ts")
  })

  it("should be able to normalize extensions with extra initial dots", () => {
    const userConfig = {
      extensions: {
        js: {
          main: ".tsx",
          index: ".ts",
          tests: ".js"
        }
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty("extensions.js", {
      main: "tsx",
      index: "ts",
      tests: "js"
    })
  })
  it("should be able to distinguish initial dots from latter ones", () => {
    const userConfig = {
      extensions: {
        js: {
          main: ".tsx",
          index: ".ts",
          tests: "spec.js"
        }
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty("extensions.js", {
      main: "tsx",
      index: "ts",
      tests: "spec.js"
    })
  })
})

describe("given that the user provided a custom stylesheet extension", () => {
  it("should be able to return a configuration object that includes a custom extension for main stylesheet", () => {
    const userConfig = {
      extensions: {
        stylesheet: {
          main: "scss"
        }
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty(
      "extensions.stylesheet.main",
      "scss"
    )
  })
})

describe("given that the user provided a custom templates path", () => {
  it("should be able to return a configuration object that includes a custom path for templates", () => {
    const userConfig = {
      paths: {
        templates: "./src/templates"
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty(
      "paths.templates",
      path.resolve(process.cwd(), "src", "templates")
    )
  })
})

describe("given that the user provided an invalid config argument", () => {
  it("should throw an error", () => {
    expect.assertions(1)
    const userConfig = []
    expect(() => {
      parseConfig(userConfig)
    }).toThrowError()
  })
  it("should throw an error with correct error type and message", () => {
    expect.assertions(2)
    const userConfig = []
    expect(() => {
      parseConfig(userConfig)
    }).toThrowError(TypeError)
    expect(() => {
      parseConfig(userConfig)
    }).toThrowError(
      "You must provide a plain object type as the configuration argument. Array provided."
    )
  })
})
