// @flow
import { compileStringTemplate, renderCompiledTemplate } from "../template"

describe("compileTemplateString", function() {
  it("should compile a template string and return an object that implements a render method", function() {
    const compiled = compileStringTemplate("Hello {{ username }}")
    const isRenderable = "render" in compiled

    expect(isRenderable).toBe(true)
  })

  it("should render a compiled template string", function() {
    const compiled = compileStringTemplate("Hello {{ username }}")
    expect(renderCompiledTemplate(compiled, { username: "jdoe" })).toBe(
      "Hello jdoe"
    )
  })
})
