import type { HistoryStore } from "../historyStore"

export default function getPathParams(historyStore: HistoryStore, _routePath: string): { [params: string]: string } | null {
  const routePath = _routePath.startsWith("/")? _routePath : "/" + _routePath
  const currentPath = historyStore.getSnapshot()

  if (/(?<=\/):[^/]+/.test(routePath)) {
    const routeRegExpString = routePath
      // `:path` 式の Route Path を名前付きキャプチャグループに変換
      .replace(/(?<=\/)(:[^/]+)/g, match => `(?<${match.replace(/^:/, "")}>[^/]+)`)
      // `*` を `.*` に変換
      .replace(/\*/g, ".*")
    const routeRegExp = new RegExp(`^${routeRegExpString}/?$`)

    return routeRegExp.exec(currentPath)?.groups ?? null
  } else {
    const routeRegExpString = routePath
      // `*` を `.*` に変換
      .replace(/\*/g, ".*")
    const routeRegExp = new RegExp(`^${routeRegExpString}/?$`)

    return routeRegExp.test(currentPath)? {} : null
  }
}