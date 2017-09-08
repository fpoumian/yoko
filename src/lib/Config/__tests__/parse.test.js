// @flow

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
          index: "js"
        },
        stylesheet: {
          main: "css"
        }
      }
    })
  })
})

describe("given that the user provided a custom components path", () => {
  it("should be able to return a configuration object includes a custom components path", () => {
    const userConfig = {
      paths: {
        components: "./src/components"
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

describe("given that the user provided a custom containers path", () => {
  it("should be able to return a configuration object includes a custom containers path", () => {
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

describe("given that the user provided a custom JS extensions", () => {
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
      index: "js"
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
      index: "ts"
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
      index: "ts"
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

  it("should be able to normalize extensions with extra dots", () => {
    const userConfig = {
      extensions: {
        js: {
          main: ".tsx",
          index: ".ts"
        }
      }
    }

    expect(parseConfig(userConfig)).toHaveProperty("extensions.js", {
      main: "tsx",
      index: "ts"
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
