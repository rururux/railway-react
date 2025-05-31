import type { PropsWithChildren } from "react"
import styles from "./styles.module.css"

export function ThreadList({ children }: PropsWithChildren) {
  return (
    <ol className={styles.threadList}>
      {children}
    </ol>
  )
}