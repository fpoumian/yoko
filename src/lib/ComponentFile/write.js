// @flow

import fse from "fs-extra"
import type { IFile } from "./interfaces"

export default function(file: IFile, data: string): Promise<string> {
  return fse
    .ensureFile(file.getPath())
    .then(() => fse.writeFile(file.getPath(), data, "utf8"))
    .then(() => file.getPath())
}
