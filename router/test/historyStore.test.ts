import { test, expect, vi } from "vitest"
import { HistoryStore } from "../historyStore"

test("subscribe, goTo", () => {
  const historyMock = vi.spyOn(history, "pushState").mockImplementation(() => {})
  const fn = vi.fn(() => "https://example.com")

  Object.defineProperty(location, "origin", {
    get() {
      return fn()
    }
  })

  const historyStore = new HistoryStore("/")

  expect(historyStore.getSnapshot()).toBe("/")

  const subscriber = vi.fn()
  const unsubscribe = historyStore.subscribe(subscriber)

  historyStore.goTo("/test")

  expect(subscriber).toBeCalledTimes(1)
  expect(historyMock).toBeCalledWith(null, "", "/test")
  expect(historyStore.getSnapshot()).toBe("/test")

  unsubscribe()
  historyStore.goTo("/test2")

  expect(subscriber).toBeCalledTimes(1)
  expect(historyMock).toBeCalledWith(null, "", "/test2")
  expect(historyStore.getSnapshot()).toBe("/test2")
})

test("eventListener", () => {
  let pathName = "/test"
  const fn = vi.fn()

  Object.defineProperty(location, "pathname", {
    get: () => pathName
  })

  const historyStore = new HistoryStore("/")

  historyStore.subscribe(fn)
  historyStore.addEventListener()
  window.dispatchEvent(new PopStateEvent("popstate"))

  expect(historyStore.getSnapshot()).toBe("/test")
  expect(fn).toBeCalledTimes(1)

  pathName = "/foo"
  historyStore.removeListener()
  window.dispatchEvent(new PopStateEvent("popstate"))

  expect(historyStore.getSnapshot()).toBe("/test")
  expect(fn).toBeCalledTimes(1)
})