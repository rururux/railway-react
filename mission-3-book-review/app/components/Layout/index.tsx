import type { PropsWithChildren } from "react"
import { Header } from "../Header"

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh grid grid-rows-[minmax(0,_auto)_1fr]">
      <Header />
      <main className="grid justify-center">
        {children}
      </main>
    </div>
  )
}