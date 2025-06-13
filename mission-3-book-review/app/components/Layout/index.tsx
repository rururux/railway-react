import type { PropsWithChildren } from "react"
import { Header } from "../Header"

export function Layout({ isLoggined = true, children }: PropsWithChildren<{ isLoggined?: boolean }>) {
  return (
    <div className="min-h-dvh grid grid-rows-[minmax(0,_auto)_1fr]">
      <Header isLoggined={isLoggined} />
      <main className="grid justify-center">
        {children}
      </main>
    </div>
  )
}