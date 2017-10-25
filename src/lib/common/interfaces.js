// @flow

export interface IFileSystem {
  ensureFile(string): Promise<any>;
  writeFile(
    string,
    string | Buffer | Uint8Array,
    ?string | Object
  ): Promise<any>;
  ensureDir(string): Promise<any>;
  remove(string): Promise<any>;
  pathExistsSync(string): boolean;
}

export interface IEventListener {
  on(eventName: string, eventListener: (any) => any): any;
}

export interface IEventEmitter {
  emit(eventName: string, data: any): boolean;
}

export interface IHasPath {
  path(): string;
}

export interface IHasName {
  getName(): string;
}
