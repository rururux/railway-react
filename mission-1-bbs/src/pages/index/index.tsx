import { Link } from "../../components/router"
import { Thread } from "../../components/thread"
import { ThreadList } from "../../components/threadList"
import { useBBSApi } from "../../hooks/useBBSApi"
import styles from "./styles.module.css"

export default function IndexPage() {
  const { data: threads, error, isLoading } = useBBSApi("/threads")

  return (
    <div>
      <h2 className={styles.pageTitle}>新着スレッド</h2>
      {threads !== undefined && (
        <ThreadList>
          {threads.map(thread => (
            <Link to={thread.id} key={thread.id}>
              <Thread>{thread.title}</Thread>
            </Link>
          ))}
        </ThreadList>
      )}
    </div>
  )
}