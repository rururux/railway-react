import type { PropsWithChildren } from "react"
import styles from "./styles.module.css"
import { Link } from "../router"

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>掲示板</h1>
        <Link className={styles.createThreadLink} to="/threads/new">スレッドをたてる</Link>
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </>
  )
}