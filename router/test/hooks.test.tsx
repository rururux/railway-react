import { describe, expect, test } from "vitest"
import { renderHook } from "vitest-browser-react"
import { useParams } from "../hooks"
import { ParamsContext } from "../context"

describe("useParams", () => {
  test("empty", async () => {
    const { result } = renderHook(() => useParams(), {
      wrapper: ({ children }) => (
        <ParamsContext.Provider value={{ params: {} }}>
          {children}
        </ParamsContext.Provider>
      )
    })

    expect(result.current).toEqual({})
  })

  test("some params", async () => {
    const { result } = renderHook(() => useParams(), {
      wrapper: ({ children }) => (
        <ParamsContext.Provider value={{ params: { foo: "bar" } }}>
          {children}
        </ParamsContext.Provider>
      )
    })

    expect(result.current).toEqual({ foo: "bar" })
  })
})