import { createContext, useContext } from "react"

export const ParamsContext = createContext<{ params: { [param: string]: string } }>({
  params: {}
})

export function useParams<T extends { [param: string]: string }>() {
  const { params } = useContext(ParamsContext)

  return params as T
}