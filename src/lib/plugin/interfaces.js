// @flow

export interface IInitialable {
  init(Object, Object): Object;
}

export interface IHasPrefixedName {
  prefixedName(): string;
}
