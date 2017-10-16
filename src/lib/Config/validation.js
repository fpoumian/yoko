// @flow
import createObjectValidator from "../Utils/validation"
import type { Config } from "./types"

const objectValidator = createObjectValidator("configuration object")

export default function(config: Config): Config {
  objectValidator.validatePlainObjectPaths(config, [
    "paths",
    "extensions",
    "rules",
    "formatting"
  ])

  objectValidator.validateStringPaths(config, [
    "paths.components",
    "paths.containers",
    "paths.templates"
  ])

  objectValidator.validateStringOrPlainObjectPaths(config, [
    "extensions.js",
    "extensions.stylesheet"
  ])

  objectValidator.validateBooleanPaths(config, [
    "rules.component-name-root-dir"
  ])

  objectValidator.validateBooleanOrPlainObjectPaths(config, [
    "formatting.prettier"
  ])

  return config
}
