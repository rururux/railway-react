import { useEffect, useState } from "react"
import { useParams } from "../../hooks/useParams"
import { useThread } from "../../hooks/useThreads"
import styles from "./styles.module.css"

export function ThreadPage() {
  const { thread_id: threadId } = useParams<{ thread_id: string }>()
  const [ offset ] = useState(0)
  const { threadData, posts, loadPosts, createPost } = useThread(threadId, offset)

  useEffect(() => {
    loadPosts()
  }, [ loadPosts ])

  if (threadData === undefined) return null

  return (
    <div className={styles.container}>
      <h2 className={styles.threadTitle}>{threadData.title}</h2>
      <div className={styles.leftContainer}>
        <ol className={styles.posts}>
          {posts.map(post => (
            <li className={styles.post} key={post.id}>{post.post}</li>
          ))}
        </ol>
      </div>
      <div className={styles.rightContainer}>
        <form className={styles.form} onSubmit={createPost}>
          <textarea className={styles.textArea} name="post" placeholder="投稿しよう！" />
          <button className={styles.submitButton}>投稿</button>
        </form>
      </div>
    </div>
  )
}