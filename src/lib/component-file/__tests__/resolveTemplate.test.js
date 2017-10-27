import path from 'path'
import makeResolveTemplate from '../resolveTemplate'

describe('resolveTemplate', () => {
  let fs
  let resolveTemplate

  beforeEach(() => {
    resolveTemplate = makeResolveTemplate(fs)
  })

  describe('given a propFiles object that does NOT contain a template property', () => {
    const fileProps = {
      name: 'index',
      extension: 'js',
      dir: path.resolve(__dirname),
      role: 'index',
    }

    it('should return null', () => {
      expect(resolveTemplate({}, fileProps)).toBe(null)
    })
  })

  describe('given a propFiles object that contains a template property', () => {
    const fileProps = {
      name: 'index',
      extension: 'js',
      dir: path.resolve(__dirname),
      role: 'index',
      template: {
        name: 'index-file.js',
        dir: path.resolve(__dirname, 'templates'),
        context: {
          componentName: 'TestComponent',
        },
      },
    }

    describe('when the global config object does not contain a custom template path', () => {
      const config = {
        paths: {},
      }

      it('should return the same template object without changing it', () => {
        expect(resolveTemplate(config, fileProps)).toEqual(fileProps.template)
      })
    })

    describe('when the global config object contains an empty string in the templates path field', () => {
      const config = {
        paths: {
          templates: '',
        },
      }
      it('should return the same template object without changing it', () => {
        expect(resolveTemplate(config, fileProps)).toEqual(fileProps.template)
      })
    })

    describe('when the global config object contains a custom path field', () => {
      const config = {
        paths: {
          templates: '/home/project/app/templates',
        },
      }

      describe('when the template file exists in the custom templates dir', () => {
        beforeEach(() => {
          fs = {
            pathExistsSync() {
              return true
            },
          }
          resolveTemplate = makeResolveTemplate(fs)
        })

        it('should return a new template object with the dir prop pointing to the custom templates path', () => {
          expect(resolveTemplate(config, fileProps)).toEqual({
            name: 'index-file.js',
            dir: '/home/project/app/templates',
            context: {
              componentName: 'TestComponent',
            },
          })
        })
      })

      describe('when the template file does not exist in the custom templates dir', () => {
        beforeEach(() => {
          fs = {
            pathExistsSync() {
              return false
            },
          }
          resolveTemplate = makeResolveTemplate(fs)
        })

        it('should return the original template object without changing it', () => {
          expect(resolveTemplate(config, fileProps)).toEqual(fileProps.template)
        })
      })
    })
  })
})
