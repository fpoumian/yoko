import mock from "mock-fs"

export function mockFileSystem(pathObj) {
  mock(pathObj)
}
