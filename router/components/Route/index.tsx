import {type  ReactNode, useContext } from "react"
import { ParamsContext, RouteContext } from "../../context"
import type { HistoryStore } from "../../historyStore"

function getPathParams(historyStore: HistoryStore, _routePath: string): { [params: string]: string } | null {
  const routePath = _routePath.startsWith("/")? _routePath : "/" + _routePath
  const currentPath = historyStore.getSnapshot()

  if (/(?<=\/):[^/]+/.test(routePath)) {
    // :path 式の Route Path を名前付きキャプチャグループに変換
    const routeRegExp = new RegExp(routePath.replace(/(?<=\/)(:[^/]+)/g, match => `(?<${match.replace(/^:/, "")}>[^/]+)`))

    return routeRegExp.exec(currentPath)?.groups ?? null
  } else {
    return currentPath === routePath? {} : null
  }
}

export function Route({ path, element }: { path: `/${string}`, element: ReactNode }) {
  const { historyStore } = useContext(RouteContext)
  const pathParams = getPathParams(historyStore, path)

  if (pathParams) return (
    <ParamsContext.Provider value={{ params: pathParams }}>
      {element}
    </ParamsContext.Provider>
  )

  return null
}