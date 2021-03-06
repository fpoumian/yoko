// @flow

import type { Config } from '../config/types'

export default function registerPlugins(config: Config): string[] {
  return [
    // register default plugins
    'main-file',
    'index-file',
    'stylesheet-file',
    // register user specified plugins
    ...(config.plugins || []),
  ]
}
