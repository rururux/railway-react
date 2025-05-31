import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type HTMLAttributes, type MouseEventHandler, type PropsWithChildren, type ReactNode } from "react"
import { HistoryStore } from "../../store/historyStore"
import { ParamsContext } from "../../hooks/useParams"

export const RouteContext = createContext<{ currentPath: string, historyStore: HistoryStore }>({
  currentPath: "/",
  historyStore: null!
})

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

export function Routes({ children }: PropsWithChildren) {
  const historyStore = useMemo(() => new HistoryStore("/"), [])
  const currentPath = useSyncExternalStore(clb => historyStore.subscribe(clb), () => historyStore.getSnapshot())

  useEffect(() => {
    historyStore.addEventListener()

    return () => historyStore.removeListener()
  }, [ historyStore ])

  return (
    <RouteContext.Provider value={{ currentPath, historyStore }}>
      {children}
    </RouteContext.Provider>
  )
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

export function Link({ to, onClick, ...props }: PropsWithChildren<Omit<HTMLAttributes<HTMLAnchorElement>, "href"> & { to: string }>) {
  const { historyStore } = useContext(RouteContext)
  const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault()
    onClick?.(e)
    historyStore.goTo(e.currentTarget.href)
  }

  return (
    <a href={to} {...props} onClick={handleClick} />
  )
}