import mock from "mock-fs"
import fs from "fs"
import path from "path"

import sayHello from "../src"

function getDirContents(path) {
  return fs.readdirSync(path)
}

function mockFileSystem() {
  mock({
    src: {
      components: {}
    }
  })
}

describe("src", () => {
  const srcDir = path.resolve(process.cwd(), "src")
  const componentsDir = path.resolve(srcDir, "components")

  beforeEach(() => {
    mockFileSystem()
  })

  it("returns hello", () => {
    expect(sayHello()).toBe("Hello, Haz!")
    expect(sayHello("foo")).toBe("Hello, foo!")
  })

  afterEach(() => {
    mock.restore()
  })
})
