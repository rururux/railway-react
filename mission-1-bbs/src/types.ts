export interface ThreadData {
  id: string
  title: string
}

export interface PostData {
  id: string
  post: string
}

export type ThreadListGetResponse = ThreadData[]
export interface PostListGetResponse {
  threadId: string
  posts: PostData[]
}
export interface ErrorReponse {
  ErrorCode: number
  ErrorMessageJP: string
  ErrorMessageEN: string
}