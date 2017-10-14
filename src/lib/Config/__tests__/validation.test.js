import validateConfig from "../validation"

describe("validateConfig", () => {
  it("should throw TypeError when catching invalid value type for config.paths", () => {
    const config = {
      paths: []
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(
      `You must pass an object as a value for paths in the configuration object. Array received instead.`
    )
  })

  it("should throw TypeError when catching invalid value type for config.extensions", () => {
    const config = {
      extensions: "js"
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(
      `You must pass an object as a value for extensions in the configuration object. String received instead.`
    )
  })

  it("should throw TypeError when catching invalid value type for config.rules", () => {
    const config = {
      rules: false
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(
      `You must pass an object as a value for rules in the configuration object. Boolean received instead.`
    )
  })

  it("should NOT throw TypeError for valid value type in config.formatting", () => {
    const config = {
      formatting: {}
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).not.toThrowError(TypeError)
  })

  it("should throw TypeError when catching invalid value type for config.paths.components", () => {
    const config = {
      paths: {
        components: true
      }
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(
      `You must pass a string as a value for paths.components in the configuration object. Boolean received instead.`
    )
  })

  it("should throw TypeError when catching invalid value type for config.paths.containers", () => {
    const config = {
      paths: {
        // eslint-disable-next-line object-shorthand
        containers: function() {}
      }
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(
      `You must pass a string as a value for paths.containers in the configuration object. Function received instead.`
    )
  })

  it("should throw TypeError when catching invalid value type for config.paths.templates", () => {
    const config = {
      paths: {
        templates: undefined
      }
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(
      `You must pass a string as a value for paths.templates in the configuration object. undefined received instead.`
    )
  })

  it("should throw TypeError when catching invalid value type for config.extensions.js", () => {
    const config = {
      extensions: {
        js: null
      }
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(
      `You must pass a string or an object as a value for extensions.js in the configuration object. Null received instead.`
    )
  })

  it("should throw TypeError when catching invalid value type for config.extensions.stylesheet", () => {
    const config = {
      extensions: {
        stylesheet: true
      }
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(
      `You must pass a string or an object as a value for extensions.stylesheet in the configuration object. Boolean received instead.`
    )
  })

  it("should throw TypeError when catching invalid value type for config.rules.component-name-root-dir", () => {
    const config = {
      rules: {
        "component-name-root-dir": {}
      }
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(
      `You must pass a boolean as a value for rules.component-name-root-dir in the configuration object. Object received instead.`
    )
  })

  it("should throw TypeError when catching invalid value type for formatting.prettier", () => {
    const config = {
      formatting: {
        prettier: []
      }
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(
      `You must pass a boolean or an object as a value for formatting.prettier in the configuration object. Array received instead.`
    )
  })

  describe("when the configuration does NOT have any invalid values", () => {
    const config = {
      paths: {
        components: "",
        containers: "",
        templates: ""
      },
      extensions: {
        js: "js",
        stylesheet: {
          main: "css"
        }
      },
      rules: {
        "component-name-root-dir": false
      },
      formatting: {
        prettier: true
      }
    }

    it("should return the valid configuration object", () => {
      expect(validateConfig(config)).toEqual(config)
    })
  })
})
