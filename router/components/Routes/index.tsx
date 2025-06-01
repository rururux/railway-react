import { type PropsWithChildren, useEffect, useMemo, useSyncExternalStore } from "react"
import { HistoryStore } from "../../historyStore"
import { RouteContext } from "../../context"

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