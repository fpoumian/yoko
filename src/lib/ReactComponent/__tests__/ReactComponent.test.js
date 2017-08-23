// @flow

import path from "path"

import ReactComponent from "../factory"
import type { ReactComponentProps } from "../types"

describe("ReactComponent", () => {
  const props: ReactComponentProps = {
    name: "TestComponent"
  }

  const component = ReactComponent(props, path.resolve(process.cwd()))

  it("should have a correct name", () => {
    expect(component.getName()).toBe("TestComponent")
  })

  it("should have a correct path", () => {
    expect(component.getPath()).toBe(
      path.resolve(process.cwd(), "TestComponent")
    )
  })
})
