import { createContext } from "react"
import type { HistoryStore } from "./historyStore"

export const RouteContext = createContext<{ currentPath: string, historyStore: HistoryStore }>({
  currentPath: "/",
  historyStore: null!
})

export const ParamsContext = createContext<{ params: { [param: string]: string } }>({
  params: {}
})