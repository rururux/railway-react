import {type  ReactNode, useContext } from "react"
import { ParamsContext, RouteContext } from "../../context"
import getPathParams from "../../utils/getPathParams"

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