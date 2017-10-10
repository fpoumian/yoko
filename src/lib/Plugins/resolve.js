// @flow
/* eslint import/no-dynamic-require: off  */
/* eslint global-require: off  */

import { isString } from "lodash"

import type { ResolvedPlugin } from "./types"
import constants from "./constants"

interface IResolver {
  resolve(string): string
}

// export default (resolver: IResolver) =>
// function resolvePlugins(pluginsNames: Array<string>): Array<ResolvedPlugin> {
//   return pluginsNames
//     .filter((pluginName: string) =>
//       isString(resolver.resolve(`${constants.PLUGIN_PREFIX}-${pluginName}`))
//     )
//     .map(pluginFileName => ({
//       path: pluginFileName,
//       name: pluginName
//     }))
// }

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
