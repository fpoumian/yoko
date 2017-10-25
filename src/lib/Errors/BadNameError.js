// @flow

export default class BadNameError extends Error {
  constructor(message: string) {
    super(message)
    this.message = message
    this.name = 'BadNameError'
  }
}
