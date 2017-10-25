// @flow

import type { IFileSystem, IHasPath } from '../common/interfaces'

export default (fs: IFileSystem) =>
  function writeComponentFile(file: IHasPath, data: string): Promise<any> {
    return fs
      .ensureFile(file.getPath())
      .then(() => fs.writeFile(file.getPath(), data, 'utf8'))
      .then(() => file.getPath())
  }
