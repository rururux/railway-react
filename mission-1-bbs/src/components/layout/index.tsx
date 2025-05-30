import type { PropsWithChildren } from "react"
import styles from "./styles.module.css"

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>掲示板</h1>
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </>
  )
}