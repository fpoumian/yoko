// @flow

export default class InvalidPluginError extends Error {
  constructor(message: string) {
    super(message)
    this.message = message
    this.name = 'InvalidPluginError'
  }
}
