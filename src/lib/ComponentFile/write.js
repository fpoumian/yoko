// @flow

import fse from "fs-extra"
import type { IReadable } from "../Readable/interfaces"

export default function(file: IReadable, data: string): Promise<string> {
  return fse
    .ensureFile(file.getPath())
    .then(() => fse.writeFile(file.getPath(), data, "utf8"))
    .then(() => file.getPath())
}
