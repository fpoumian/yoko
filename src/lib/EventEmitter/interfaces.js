// @flow

export interface IEventListener {
  on(eventName: string, eventListener: (any) => any): any
}
