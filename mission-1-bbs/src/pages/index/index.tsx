import { useEffect } from "react"
import { Link } from "../../components/router"
import { Thread } from "../../components/thread"
import { ThreadList } from "../../components/threadList"
import { useThreads } from "../../hooks/useThreads"
import styles from "./styles.module.css"

export default function IndexPage() {
  const { threads, loadThreads } = useThreads()

  useEffect(() => {
    loadThreads()
  }, [ loadThreads ])

  return (
    <div>
      <h2 className={styles.pageTitle}>新着スレッド</h2>
      {threads !== undefined && (
        <ThreadList>
          {Array.from(threads.values()).map(thread => (
            <Link to={`/threads/${thread.id}`} key={thread.id}>
              <Thread>{thread.title}</Thread>
            </Link>
          ))}
        </ThreadList>
      )}
    </div>
  )
}