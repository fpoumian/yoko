// @flow

import type { Template } from "../Template/types"
import type { IFile } from "./interfaces"

export type FileProps = {
  name: string,
  extension: string,
  dir: string,
  template: Template | null,
  role: string
}

export type writeFile = (file: IFile, data: string) => Promise<string>
