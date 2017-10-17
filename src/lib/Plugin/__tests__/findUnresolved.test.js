import findUnresolved from '../findUnresolved'

describe('findUnresolved', () => {
  const resolvedPlugins = [
    {
      name: 'index-file',
    },
    {
      name: 'main-file',
    },
  ]

  const pluginNames = ['index-file', 'main-file', 'tests-file']

  it('should find unresolved plugins', () => {
    const result = findUnresolved(resolvedPlugins, pluginNames)
    expect(result).toContain('tests-file')
    expect(result).not.toContain('index-file')
    expect(result).not.toContain('main-file')
  })
})
