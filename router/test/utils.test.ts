import { describe, expect, test } from "vitest"
import getPathParams from "../utils/getPathParams"
import type { HistoryStore } from "../historyStore"

describe("getPathParams", () => {
  test("path", () => {
    let currentPath = "/"
    const historyStoreMock = { getSnapshot: () => currentPath } as HistoryStore

    expect(getPathParams(historyStoreMock, "/")).toEqual({})

    currentPath = "/test/"

    expect(getPathParams(historyStoreMock, "/test")).toEqual({})

    currentPath = "/user/john"

    expect(getPathParams(historyStoreMock, "/:slug")).toBe(null)
    expect(getPathParams(historyStoreMock, "/user/:name")).toEqual({ name: "john" })
    expect(getPathParams(historyStoreMock, "/author/:name")).toBe(null)

    currentPath = "/article/attension-is-all-you-need/comment/1"

    expect(getPathParams(historyStoreMock, "/article/:slug/comment/:commentId")).toEqual({
      slug: "attension-is-all-you-need",
      commentId: "1"
    })

    currentPath = "/foo"

    expect(getPathParams(historyStoreMock, "/*")).toEqual({})
    expect(getPathParams(historyStoreMock, "/foo*")).toEqual({})
    expect(getPathParams(historyStoreMock, "/foo/*")).toBe(null)
    expect(getPathParams(historyStoreMock, "foo/:bar")).toBe(null)
    expect(getPathParams(historyStoreMock, "/wro:ng")).toBe(null)
  })
})