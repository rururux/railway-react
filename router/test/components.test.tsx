import { describe, test, expect, vi } from "vitest"
import { render } from "vitest-browser-react"
import { Link } from "../components/Link"
import { RouteContext } from "../context"
import { HistoryStore } from "../historyStore"
import { MouseEvent } from "react"
import { Route } from "../components/Route"

describe("Link", () => {
  test("handleClick", async () => {
    const initialPath = location.pathname
    const historyStore = new HistoryStore(initialPath)
    const screen = render(
      <RouteContext.Provider value={{ currentPath: initialPath, historyStore }}>
        <Link to="./test">Link</Link>
      </RouteContext.Provider>
    )

    expect(historyStore.getSnapshot()).toBe(initialPath)

    await expect.element(screen.getByRole("link")).toBeInTheDocument()
    await screen.getByRole("link").click()

    expect(location.pathname).toBe(`${initialPath}test`)
    expect(historyStore.getSnapshot()).toBe(`${initialPath}test`)
  })

  test("preventDefault", async () => {
    const handleClick = vi.fn((e: MouseEvent) => e.preventDefault())

    const initialPath = location.pathname
    const historyStore = new HistoryStore(initialPath)
    const screen = render(
      <RouteContext.Provider value={{ currentPath: initialPath, historyStore }}>
        <Link to="./test" onClick={handleClick}>Link</Link>
      </RouteContext.Provider>
    )

    expect(historyStore.getSnapshot()).toBe(initialPath)

    await expect.element(screen.getByRole("link")).toBeInTheDocument()
    await screen.getByRole("link").click()

    expect(location.pathname).toBe(initialPath)
    expect(historyStore.getSnapshot()).toBe(initialPath)
  })
})

describe("Route", () => {
  test("render", async () => {
    const initialPath = location.pathname as `/${string}`
    const historyStore = new HistoryStore(initialPath)
    const screen = render(
      <RouteContext.Provider value={{ currentPath: initialPath, historyStore }}>
        <Route path={initialPath} element={<div data-testId="div" />} />
      </RouteContext.Provider>
    )

    await expect.element(screen.getByTestId("div")).toBeInTheDocument()
  })

  test("do not render", async () => {
    const initialPath = "/"
    const historyStore = new HistoryStore(initialPath)
    const screen = render(
      <RouteContext.Provider value={{ currentPath: initialPath, historyStore }}>
        <Route path={"/test"} element={<div data-testId="div" />} />
      </RouteContext.Provider>
    )

    await expect.element(screen.getByTestId("div")).not.toBeInTheDocument()
  })
})