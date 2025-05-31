import { useContext } from "react"
import { ParamsContext } from "./context"

export function useParams<T extends { [param: string]: string }>() {
  const { params } = useContext(ParamsContext)

  return params as T
}