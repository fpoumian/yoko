// @flow

import type { IFileSystem, IHasPath } from '../common/interfaces'

export default (fs: IFileSystem) =>
  function writeComponentFile(file: IHasPath, data: string): Promise<any> {
    return fs
      .ensureFile(file.path())
      .then(() => fs.writeFile(file.path(), data, 'utf8'))
      .then(() => file.path())
  }
