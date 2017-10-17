// @flow

export type Config = {
  paths: {
    components: string,
    containers: string,
    templates: string,
  },
  extensions: {
    js: {
      main: string,
      index: string,
      tests: string,
    },
    stylesheet: {
      main: string,
    },
  },
  plugins?: string[],
  rules: {
    'component-name-root-dir': boolean,
  },
  formatting: {
    prettier: boolean | Object,
  },
}
