import useSWR from "swr"
import type { ThreadListGetResponse, PostListGetResponse, ErrorReponse } from "../types"

type ValidPath = "/threads" | `/theads/${number}/posts`

export function useBBSApi<T extends ValidPath>(path: T) {
  const resp = useSWR<
    T extends "/threads"? ThreadListGetResponse : PostListGetResponse, ErrorReponse
  >(
    `https://railway.bulletinboard.techtrain.dev${path}`,
    (resource: RequestInfo | URL, init?: RequestInit) => fetch(resource, init).then(res => res.json())
  )

  return resp
}