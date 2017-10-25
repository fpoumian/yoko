// @flow

import type { IReadable } from '../Readable/interfaces'
import type { IFileSystem } from '../common/interfaces'

export default (fs: IFileSystem) =>
  function writeComponentFile(file: IReadable, data: string): Promise<any> {
    return fs
      .ensureFile(file.getPath())
      .then(() => fs.writeFile(file.getPath(), data, 'utf8'))
      .then(() => file.getPath())
  }
