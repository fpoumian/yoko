// @flow
export interface IFile {
  getName(): string,
  getExtension(): string,
  getPath(): string,
  getTemplatePath(): string | null,
  getRole(): string
}
