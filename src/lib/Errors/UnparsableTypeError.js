// @flow
export default class UnparsableTypeError extends TypeError {
  constructor(
    message?: string = "Type cannot be parsed by the Babylon parser."
  ): void {
    super()
    this.message = message
  }
}
