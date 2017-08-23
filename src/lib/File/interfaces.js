// @flow
export interface IFile {
  getName(): string,
  getExtension(): string,
  getPath(): string,
  getTemplateString(): string,
  getRole(): string
}
