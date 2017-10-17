// @flow

import type { IComponentFile, IFile } from './interfaces'
import type { IReadable } from '../Readable/interfaces'

export type ComponentFile = IFile & IReadable & IComponentFile

export type FileProps = {
  name: string,
  extension: string,
  dir: string,
  template: Object | null,
  role: string,
}
