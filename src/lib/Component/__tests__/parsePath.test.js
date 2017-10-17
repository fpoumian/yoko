import parseComponentPath from '../parsePath'

describe('parseComponentPath', () => {
  describe('given a name with nested directories', () => {
    it('should get name info from the given path', () => {
      expect.assertions(1)
      expect(parseComponentPath('Parent/SubParent/ComponentName')).toEqual({
        rootName: 'ComponentName',
        componentName: 'ComponentName',
        parentDirs: ['Parent', 'SubParent'],
      })
    })
    it('should be able to remove trailing slash', () => {
      expect.assertions(1)
      expect(parseComponentPath('Parent/SubParent/ComponentName/')).toEqual({
        rootName: 'ComponentName',
        componentName: 'ComponentName',
        parentDirs: ['Parent', 'SubParent'],
      })
    })
    it('should be able to remove initial slash', () => {
      expect.assertions(1)
      expect(parseComponentPath('/Parent/SubParent/ComponentName')).toEqual({
        rootName: 'ComponentName',
        componentName: 'ComponentName',
        parentDirs: ['', 'Parent', 'SubParent'],
      })
    })
    it('should be able to handle path with file extension', () => {
      expect.assertions(1)
      expect(
        parseComponentPath('/Parent/SubParent/ComponentName.jsx')
      ).toEqual({
        rootName: 'ComponentName',
        componentName: 'ComponentName',
        parentDirs: ['', 'Parent', 'SubParent'],
      })
    })

    describe('given a configuration with the component-name-root-dir rule set to false ', () => {
      const config = {
        rules: {
          'component-name-root-dir': false,
        },
      }
      it('should return the correct rootName when path is nested', () => {
        expect.assertions(1)
        expect(
          parseComponentPath('Parent/SubParent/ComponentName', config)
        ).toEqual({
          rootName: 'SubParent',
          componentName: 'ComponentName',
          parentDirs: ['Parent'],
        })
      })
      it('should return the correct rootName when path is not nested', () => {
        expect.assertions(1)
        expect(parseComponentPath('ComponentName', config)).toEqual({
          rootName: '',
          componentName: 'ComponentName',
          parentDirs: [],
        })
      })
    })
  })
  describe('given a path without nested directories', () => {
    const name = 'ComponentName'
    it('should get name info from the given path', () => {
      expect.assertions(1)
      expect(parseComponentPath(name)).toEqual({
        rootName: name,
        componentName: name,
        parentDirs: [],
      })
    })
  })
  describe('given a name with invalid filename/dirnames', () => {
    const name = 'Parent?/<SubParent>/Component:Name*'
    it('should get name info from the given path', () => {
      expect.assertions(1)
      expect(parseComponentPath(name)).toEqual({
        rootName: 'ComponentName',
        componentName: 'ComponentName',
        parentDirs: ['Parent', 'SubParent'],
      })
    })
  })
})
