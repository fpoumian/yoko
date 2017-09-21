// @flow
import { get } from "lodash"
import path from "path"

import type { IFile } from "../ComponentFile/interfaces"
import type {
  ReactComponentFileTemplatePaths,
  ReactComponentProps
} from "../ReactComponent/types"
import type { Config } from "../Config/types"
import defaultConfig from "../Config/default"
import createTemplate from "../Template/factory"
import type { ComponentFile, createComponentFile } from "../ComponentFile/types"

// export default function() : Map<string, IFile> {
//   return new Map()
// }
//
// export default (createComponentFile: createComponentFile) => (
//   props: ReactComponentProps,
//   config: Config,
//   templatePaths: ReactComponentFileTemplatePaths
// ): Map<string, ComponentFile> => {
//   const fileList = new Map()
//   fileList.set(
//     "main",
//     createComponentFile({
//       name: props.name,
//       extension: get(
//         config,
//         "extensions.js.main",
//         defaultConfig.extensions.js.main
//       ),
//       dir: props.path,
//       role: "main",
//       // template: createTemplate({ path: templatePaths.main, name: "main" })
//     })
//   )
//
//   if (props.index) {
//     fileList.set(
//       "index",
//       createComponentFile({
//         name: "index",
//         extension: get(
//           config,
//           "extensions.js.index",
//           defaultConfig.extensions.js.index
//         ),
//         dir: props.path,
//         role: "index",
//         template: createTemplate({ path: templatePaths.index, name: "index" })
//       })
//     )
//   }
//
//   if (props.stylesheet) {
//     fileList.set(
//       "stylesheet",
//       createComponentFile({
//         name: "styles",
//         extension: get(
//           config,
//           "extensions.stylesheet.main",
//           defaultConfig.extensions.stylesheet.main
//         ),
//         dir: props.path,
//         role: "stylesheet",
//         template: null
//       })
//     )
//   }
//
//   if (props.tests) {
//     fileList.set(
//       "tests",
//       createComponentFile({
//         name: `${props.name}.test`,
//         extension: get(
//           config,
//           "extensions.js.tests",
//           defaultConfig.extensions.js.tests
//         ),
//         dir: path.resolve(props.path, "__tests__"),
//         role: "tests",
//         template: createTemplate({ path: templatePaths.tests, name: "tests" })
//       })
//     )
//   }
//   return fileList
// }
