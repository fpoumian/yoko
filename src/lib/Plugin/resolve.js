// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import type { ResolvedPlugin } from "./types"
import constants from "./constants"

interface IResolver {
  resolve(string): string
}

export default (resolver: IResolver) =>
  function resolvePlugins(pluginsNames: Array<string>): Array<ResolvedPlugin> {
    return pluginsNames.reduce(
      (pluginsAcc: Array<ResolvedPlugin>, pluginName: string) => {
        try {
          return [
            ...pluginsAcc,
            {
              path: resolver.resolve(
                `${constants.PLUGIN_PREFIX}-${pluginName}`
              ),
              name: pluginName
            }
          ]
        } catch (e) {
          return pluginsAcc
        }
      },
      []
    )
  }
