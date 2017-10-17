import judex, { addEventListener } from '../src'

describe('addEventListener', () => {
  describe('given no additional plugins were specified in global config object', () => {
    it('should emit pluginsRegistered event that returns an array of three plugins', done => {
      addEventListener('pluginsRegistered', plugins => {
        expect(plugins).toHaveLength(3)
        done()
      })
      judex()
    })
  })
})
