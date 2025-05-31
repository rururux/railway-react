import type { PropsWithChildren } from "react"
import styles from "./styles.module.css"

export function Thread({ children }: PropsWithChildren) {
  return (
    <li className={styles.thread}>{children}</li>
  )
}