import { createContext, useCallback, useContext, useState, type Dispatch, type FormEventHandler, type SetStateAction } from "react"
import type { PostData, PostListGetResponse, ThreadData, ThreadListGetResponse } from "../types"

const baseUrl = "https://railway.bulletinboard.techtrain.dev"

export const ThreadsContext = createContext<{
  threads: Map<ThreadData["id"], ThreadData>,
  setThreads: Dispatch<SetStateAction<Map<ThreadData["id"], ThreadData>>>
}>({ threads: new Map(), setThreads: () => {} })

export function useThreadsContext() {
  const [ threads, setThreads ] = useState(() => new Map())

  return { threads, setThreads }
}

export function useThreads() {
  const { threads, setThreads } = useContext(ThreadsContext)
  const loadThreads = useCallback(async () => {
    const threads = await fetch(`${baseUrl}/threads`).then<ThreadListGetResponse>(r => r.json())

    setThreads(map => {
      const newThreadsData = threads.map(thread => [ thread.id, thread ] as const)

      return new Map([ ...map, ...newThreadsData ])
    })
  }, [ setThreads ])

  return { threads, loadThreads }
}

export function useThread(threadId: string, offset: number) {
  const { threads } = useContext(ThreadsContext)
  const [ postsMap, setPostsMap ] = useState<Map<number, PostData[]>>(() => new Map())
  const threadData = threads.get(threadId)
  const loadPosts = useCallback(async () => {
    const postsGetResponse = await fetch(`${baseUrl}/threads/${threadId}/posts?offset=${offset}`).then<PostListGetResponse>(r => r.json())

    setPostsMap(postsMap => new Map([ ...postsMap, [ offset, postsGetResponse.posts ] ]))
  }, [ threadId, offset ])
  const posts = Array.from(postsMap.entries())
    .sort(([ offsetA ], [ offsetB ]) => offsetA - offsetB)
    .flatMap(entries => entries[1])

  const createPost: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const post = formData.get("post")

    if (post === undefined) return

    fetch(`${baseUrl}/threads/${threadId}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post })
    }).then(r => {
      if (r.ok) {
        loadPosts()
      } else {
        console.error(r.status)
        r.json().then(console.error)
      }
    })
  }

  if (threadData === undefined) {
    throw new Error("thread not found")
  }

  return { threadData, posts, loadPosts, createPost }
}