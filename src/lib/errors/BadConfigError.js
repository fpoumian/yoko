// @flow

export default class BadConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.message = message
    this.name = 'BadConfigError'
  }
}
