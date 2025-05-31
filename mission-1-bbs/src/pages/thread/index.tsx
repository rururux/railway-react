import { useEffect, useState } from "react"
import { useParams } from "../../hooks/useParams"
import { useThread } from "../../hooks/useThreads"
import styles from "./styles.module.css"

export function ThreadPage() {
  const { thread_id: threadId } = useParams<{ thread_id: string }>()
  const [ offset ] = useState(0)
  const { threadData, posts, loadPosts } = useThread(threadId, offset)

  useEffect(() => {
    loadPosts()
  }, [ loadPosts ])

  return (
    <div>
      <div className={styles.leftContainer}>
        <h2 className={styles.threadTitle}>{threadData.title}</h2>
        <ol className={styles.posts}>
          {posts.map(post => (
            <li className={styles.post} key={post.id}>{post.post}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}