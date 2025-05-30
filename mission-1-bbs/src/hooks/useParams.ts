import { createContext, useContext } from "react"

export const ParamsContext = createContext<{ params: { [param: string]: string } | undefined }>({
  params: undefined
})

export function useParams() {
  const { params } = useContext(ParamsContext)

  return params
}