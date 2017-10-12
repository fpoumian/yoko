// @flow

export interface IFileSystem {
  ensureFile(string): Promise<any>,
  writeFile(
    string,
    string | Buffer | Uint8Array,
    ?string | Object
  ): Promise<any>,
  ensureDir(string): Promise<any>,
  remove(string): Promise<any>,
  pathExistsSync(string): boolean
}
