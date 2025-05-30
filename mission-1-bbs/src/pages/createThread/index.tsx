import { useContext, type FormEventHandler } from "react"
import { Link, RouteContext } from "../../components/router"
import styles from "./styles.module.css"

export default function CreateThreadPage() {
  const { historyStore } = useContext(RouteContext)
  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const threadTitle = formData.get("thread-name")

    if (threadTitle === null) {
      console.error("threadTitle is null")
      return
    }

    fetch("https://railway.bulletinboard.techtrain.dev/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: threadTitle })
    })
      .then(r => {
        if(r.ok) {
          historyStore.goTo("/")
        } else {
          console.error(r.status)
          r.json().then(console.error)
        }
      })
  }

  return (
    <div style={{ width: 600 }}>
      <h2 className={styles.pageTitle}>スレッド新規作成</h2>
      <form onSubmit={handleSubmit}>
        <input className={styles.threadTitleInput} name="thread-name" type="text" placeholder="スレッドタイトル" />
        <div className={styles.formFooter}>
          <Link className={styles.backLink} to="/">Topに戻る</Link>
          <button className={styles.submit}>作成</button>
        </div>
      </form>
    </div>
  )
}