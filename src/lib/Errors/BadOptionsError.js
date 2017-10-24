// @flow

export default class BadOptionsError extends Error {
  constructor(message: string) {
    super(message)
    this.message = message
    this.name = 'BadOptionsError'
  }
}
