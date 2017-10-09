// @flow

import type { IReadable } from "../Readable/interfaces"
import type { IFileSystem } from "../FileSystem/interfaces"

export default (fs: IFileSystem) =>
  function(file: IReadable, data: string): Promise<any> {
    return fs
      .ensureFile(file.getPath())
      .then(() => fs.writeFile(file.getPath(), data, "utf8"))
      .then(() => file.getPath())
  }
