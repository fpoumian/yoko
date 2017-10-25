import { validateComponentOptions, validateComponentName } from '../validation'
import BadOptionsError from '../../errors/BadOptionsError'
import BadNameError from '../../errors/BadNameError'

describe('validateComponentOptions', () => {
  it('should throw error when options is not an object', () => {
    const options = []

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(BadOptionsError)
  })

  it('should throw error when container option is not a boolean', () => {
    const options = {
      container: 'false',
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(BadOptionsError)
  })

  it('should throw error when main option is not a boolean', () => {
    const options = {
      main: 1,
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(BadOptionsError)
  })

  it('should throw error when index option is not a boolean', () => {
    const options = {
      index: [],
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(BadOptionsError)
  })

  it('should throw error when stylesheet option is not a boolean', () => {
    const options = {
      stylesheet: {},
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(BadOptionsError)
  })

  it('should throw error when tests option is not a boolean', () => {
    const options = {
      tests: 0,
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(BadOptionsError)
  })

  it('should throw error when es6class option is not a boolean', () => {
    const options = {
      es6class: [],
    }

    expect(() => {
      validateComponentOptions(options)
    }).toThrowError(BadOptionsError)
  })
})

describe('validateComponentName', () => {
  it('should throw TypeError when component path is not a string', () => {
    const path = 1
    expect(() => {
      validateComponentName(path)
    }).toThrowError(BadNameError)
  })

  it('should throw when component path is an empty string', () => {
    const path = ''
    expect(() => {
      validateComponentName(path)
    }).toThrowError(BadNameError)
  })

  it('should throw error when component path contains invalid characters', () => {
    expect(() => {
      validateComponentName('Parent?/')
    }).toThrowError(BadNameError)
    expect(() => {
      validateComponentName('Parent/*.js')
    }).toThrowError(BadNameError)
    expect(() => {
      validateComponentName('<Parent/')
    }).toThrowError(BadNameError)
    expect(() => {
      validateComponentName('|Parent/')
    }).toThrowError(BadNameError)
  })

  describe('When the OS is Windows', () => {
    beforeEach(() => {
      process.platform = 'win32'
    })

    it('should throw error when component path contains a reserved word', () => {
      expect(() => {
        validateComponentName('aux')
      }).toThrowError(BadNameError)
    })
  })
})
