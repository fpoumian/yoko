import path from 'path'

import reduceComponentPaths from '../reducePaths'

describe('reduceComponentPaths', () => {
  const component = {
    getPath: () => path.resolve(__dirname),
    getFiles: () => {},
    getName: () => '',
  }

  const filePaths = [
    {
      main: path.resolve(__dirname, 'TestComponent.js'),
    },
    {
      index: path.resolve(__dirname, 'index.js'),
    },
    {
      stylesheet: path.resolve(__dirname, 'styles.css'),
    },
  ]

  it('should return a reduced object of paths', () => {
    expect(reduceComponentPaths(component, filePaths)).toEqual({
      root: path.resolve(__dirname),
      main: path.resolve(__dirname, 'TestComponent.js'),
      index: path.resolve(__dirname, 'index.js'),
      stylesheet: path.resolve(__dirname, 'styles.css'),
    })
  })
})
