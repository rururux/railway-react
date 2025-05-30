import { Link } from "../../components/router"
import { Thread } from "../../components/thread"
import { ThreadList } from "../../components/threadList"
import { useBBSApi } from "../../hooks/useBBSApi"

export default function IndexPage() {
  const { data: threads, error, isLoading } = useBBSApi("/threads")

  return (
    <div>
      <h2>新着スレッド</h2>
      {threads !== undefined && (
        <ThreadList>
          {threads.map(thread => (
            <Link to={thread.id}>
              <Thread>{thread.title}</Thread>
            </Link>
          ))}
        </ThreadList>
      )}
    </div>
  )
}