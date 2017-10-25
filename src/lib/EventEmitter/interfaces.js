// @flow

export interface IEventListener {
  on(eventName: string, eventListener: (any) => any): any;
}

export interface IEventEmitter {
  emit(eventName: string, data: any): boolean;
}
