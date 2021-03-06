/* eslint-disable handle-callback-err */
import fs from 'fs'
import path from 'path'

import {
  validateStatelessFunctionalComponent,
  validateIndexFile,
  validateES6ClassComponent,
  validateJSXIdentifier,
  validateTestsFile,
  validateStandardJSFormattting,
} from '../validation'

const sfComponent = path.resolve(
  __dirname,
  '..',
  '__mocks__',
  'StatelessFunctionalComponent.js'
)

const es6ClassComponent = path.resolve(
  __dirname,
  '..',
  '__mocks__',
  'ES6ClassComponent.js'
)

const indexFile = path.resolve(__dirname, '..', '__mocks__', 'IndexFile.js')

const testsFile = path.resolve(__dirname, '..', '__mocks__', 'TestsFile.js')

describe('validateStatelessFunctionalComponent', () => {
  it('should validate a correct React Stateless Functional component file', done => {
    expect.assertions(1)
    fs.readFile(sfComponent, 'utf8', (err, data) => {
      expect(validateStatelessFunctionalComponent(data, 'TestComponent')).toBe(
        true
      )
      done()
    })
  })
  it('should not validate a React ES6 Class component file', done => {
    expect.assertions(1)
    fs.readFile(es6ClassComponent, 'utf8', (err, data) => {
      expect(validateStatelessFunctionalComponent(data, 'TestComponent')).toBe(
        false
      )
      done()
    })
  })
})

describe('validateE6ClassComponent', () => {
  it('should validate a correct React ES6 Class component file', done => {
    expect.assertions(1)
    fs.readFile(es6ClassComponent, 'utf8', (err, data) => {
      expect(validateES6ClassComponent(data, 'TestComponent')).toBe(true)
      done()
    })
  })
  it('should not validate a Stateless Functional component file', done => {
    expect.assertions(1)
    fs.readFile(sfComponent, 'utf8', (err, data) => {
      expect(validateES6ClassComponent(data, 'TestComponent')).toBe(false)
      done()
    })
  })
})

describe('validateIndexFile', () => {
  it('should validate a correct React component index file', done => {
    expect.assertions(1)
    fs.readFile(indexFile, 'utf8', (err, data) => {
      expect(validateIndexFile(data, 'StatelessFunctionalComponent')).toBe(true)
      done()
    })
  })
})

describe('validateTestsFile', () => {
  it('should validate a correct React component tests file', done => {
    expect.assertions(1)
    fs.readFile(testsFile, 'utf8', (err, data) => {
      expect(validateTestsFile(data, 'TestComponent')).toBe(true)
      done()
    })
  })
})

describe('validateStandardJSFormatting', () => {
  it('should validate StandardJS formatting inside a component file', done => {
    expect.assertions(1)
    fs.readFile(sfComponent, 'utf8', (err, data) => {
      expect(validateStandardJSFormattting(data)).toBe(false)
      done()
    })
  })
})

describe('validateJSXElement', () => {
  it('should validate JSX Element inside a component file', () => {
    expect.assertions(1)
    const JSX = `<div>
    <TestElement/>
      <p>React Component</p>
    </div>`
    expect(validateJSXIdentifier(JSX, 'TestElement')).toBe(true)
  })
})
