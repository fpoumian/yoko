// @flow

export type Config = {
  paths: {
    components: string,
    containers: string
  },
  extensions: {
    js: {
      main: string,
      index: string
    },
    stylesheet: {
      main: string
    }
  }
}
