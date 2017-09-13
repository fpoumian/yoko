import createFileList from "../factory"

xdescribe("createFileList", () => {
  it("should have no files by default", () => {
    const files = createFileList()
    expect(files.size).toBe(0)
  })

  it("should be able to add new Files using the role as the key of map", () => {
    expect.assertions(3)
    const files = createFileList()
    const newFile = {
      getRole: () => "main",
      getExtension: () => "",
      getPath: () => "",
      getName: () => "",
      getTemplatePath: () => ""
    }
    files.set(newFile.getRole(), newFile)
    expect(files.size).toBe(1)
    expect(files.has("main")).toBe(true)
    const file = files.get("main")
    if (typeof file !== "undefined") {
      expect(file.getRole()).toBe("main")
    }
  })

  it("should only have File objects with unique role property", () => {
    const files = createFileList()
    const indexFile = {
      getRole: () => "index",
      getExtension: () => "",
      getPath: () => "",
      getName: () => "",
      getTemplatePath: () => ""
    }
    const indexFile2 = {
      getRole: () => "index",
      getExtension: () => "",
      getPath: () => "",
      getName: () => "Index2",
      getTemplatePath: () => ""
    }
    files.set(indexFile.getRole(), indexFile)
    expect(files.size).toBe(1)
    files.set(indexFile2.getRole(), indexFile2)
    expect(files.size).toBe(1)
    const file = files.get("index")
    if (typeof file !== "undefined") {
      expect(file.getName()).toBe("Index2")
    }
  })
})
