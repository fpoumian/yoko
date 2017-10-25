// @flow

import type {
  ICanRenderOutput,
  IFile,
  IHasExtension,
  IHasRole,
  IHasTemplate,
} from './interfaces'
import type { IHasName } from '../common/interfaces'

export type ComponentFile = IHasTemplate &
  IHasExtension &
  IHasName &
  IHasRole &
  ICanRenderOutput

export type FileProps = {
  name: string,
  extension: string,
  dir: string,
  template: Object,
  role: string,
}
