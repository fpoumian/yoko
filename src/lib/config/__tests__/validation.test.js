import validateConfig from '../validation'
import BadConfigError from '../../errors/BadConfigError'

describe('validateConfig', () => {
  it('should throw BadConfigError when catching invalid value type for config.paths', () => {
    const config = {
      paths: [],
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(BadConfigError)
  })

  it('should throw BadConfigError when catching invalid value type for config.extensions', () => {
    const config = {
      extensions: 'js',
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(BadConfigError)
  })

  it('should throw BadConfigError when catching invalid value type for config.rules', () => {
    const config = {
      rules: false,
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(BadConfigError)
  })

  it('should NOT throw BadConfigError for valid value type in config.formatting', () => {
    const config = {
      formatting: {},
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).not.toThrowError(BadConfigError)
  })

  it('should throw BadConfigError when catching invalid value type for config.paths.components', () => {
    const config = {
      paths: {
        components: true,
      },
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(BadConfigError)
  })

  it('should throw BadConfigError when catching invalid value type for config.paths.containers', () => {
    const config = {
      paths: {
        // eslint-disable-next-line object-shorthand
        containers: function() {},
      },
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(BadConfigError)
  })

  it('should throw BadConfigError when catching invalid value type for config.extensions.js', () => {
    const config = {
      extensions: {
        js: null,
      },
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(BadConfigError)
  })

  it('should throw BadConfigError when catching invalid value type for config.extensions.stylesheet', () => {
    const config = {
      extensions: {
        stylesheet: true,
      },
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(BadConfigError)
  })

  it('should throw BadConfigError when catching invalid value type for config.rules.component-name-root-dir', () => {
    const config = {
      rules: {
        'component-name-root-dir': [],
      },
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(BadConfigError)
  })

  it('should throw BadConfigError when catching invalid value type for formatting.prettier', () => {
    const config = {
      formatting: {
        prettier: [],
      },
    }
    expect.assertions(1)
    expect(() => {
      validateConfig(config)
    }).toThrowError(BadConfigError)
  })

  describe('when the configuration does NOT have any invalid values', () => {
    const config = {
      paths: {
        components: './path',
        containers: './path',
        templates: './path',
      },
      extensions: {
        js: {
          main: 'js',
        },
        stylesheet: {
          main: 'css',
        },
      },
      rules: {
        'component-name-root-dir': false,
      },
      formatting: {
        prettier: true,
      },
    }

    it('should return the valid configuration object', () => {
      expect(validateConfig(config)).toEqual(config)
    })
  })
})
