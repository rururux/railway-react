import type { HTMLAttributes } from "react"
import { useRoute } from "wouter"

export function Layout(props: Omit<HTMLAttributes<HTMLDivElement>, "className" | "style">) {
  const [ isHomeRoute ] = useRoute("/")
  const [ isProfileRoute ] = useRoute("/profile")
  let backgroundImage: string

  if (isHomeRoute) {
    backgroundImage = "linear-gradient(220.55deg, #5D85A6 0%, #0E2C5E 100%)"
  } else if (isProfileRoute) {
    backgroundImage = "linear-gradient(220.55deg, #565656 0%, #181818 100%)"
  } else {
    // 404
    backgroundImage = "linear-gradient(220.55deg, #FF0000 0%, #470000 100%)"
  }

  return (
    <div className="min-h-dvh grid grid-rows-[minmax(0,auto)_1fr] place-items-center" {...props} style={{ backgroundImage }} />
  )
}