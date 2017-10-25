import makeRenderTemplate from '../render'
import nunjucks from 'nunjucks'

describe('render', () => {
  let fileFormatter
  let require
  let prettierConfig
  let renderTemplate
  let template

  beforeEach(() => {
    fileFormatter = {
      format: jest.fn().mockImplementation(renderedFile => renderedFile),
    }
    require = jest.fn().mockReturnValue('Hello {{ value }}')
    prettierConfig = true
    renderTemplate = makeRenderTemplate(
      nunjucks,
      fileFormatter,
      prettierConfig,
      require
    )
  })

  describe('given a template', () => {
    beforeEach(() => {
      template = {
        getPath: () => '',
        getContext: () => ({
          value: 'World',
        }),
      }
    })

    it('should return Hello World', () => {
      expect(renderTemplate(template)).toEqual('Hello World')
    })

    it('should call the fileFormatter.format method once', () => {
      renderTemplate(template)
      expect(fileFormatter.format).toHaveBeenCalledTimes(1)
    })

    it('should call the fileFormatter.format method with the rendered file string', () => {
      renderTemplate(template)
      expect(fileFormatter.format).toHaveBeenCalledWith('Hello World')
    })

    describe('when the prettierConfig argument is an object', () => {
      beforeEach(() => {
        prettierConfig = {}
        renderTemplate = makeRenderTemplate(
          nunjucks,
          fileFormatter,
          prettierConfig,
          require
        )
      })
      it('should call the fileFormatter.format method with the rendered file string and the prettier config', () => {
        renderTemplate(template)
        expect(fileFormatter.format).toHaveBeenCalledWith(
          'Hello World',
          prettierConfig
        )
      })
    })
  })
})
