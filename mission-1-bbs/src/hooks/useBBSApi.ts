import useSWR from "swr"
import type { ThreadListGetResponse, PostListGetResponse, ErrorReponse } from "../types"

type ValidPath = "/threads" | `/theads/${number}/posts`

export function useBBSApi<T extends ValidPath>(path: T) {
  return useSWR<T extends "/threads"? ThreadListGetResponse : PostListGetResponse, ErrorReponse>(`https://railway.bulletinboard.techtrain.dev${path}`)
}