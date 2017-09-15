// @flow

import type { ITemplate } from "../Template/interfaces"

export type FileProps = {
  name: string,
  extension: string,
  dir: string,
  template: ITemplate,
  role: string
}
