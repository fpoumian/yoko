import path from "path"

import addComponentFile from "../add-file"

xdescribe("add-file", () => {
  it("should be able to add new files", () => {
    const result = addComponentFile(() => ({
      name: "actions",
      extension: "js",
      dir: path.resolve(__dirname, "components"),
      role: "actions",
      template: {
        path: path.resolve(__dirname, "templates"),
        name: "ActionFileTemplate.js"
      }
    }))
    expect(result).toEqual({
      name: "actions",
      extension: "js",
      dir: path.resolve(__dirname, "components"),
      role: "actions",
      template: {
        path: path.resolve(__dirname, "templates"),
        name: "ActionFileTemplate.js"
      }
    })
  })
})
