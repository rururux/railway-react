import { type HTMLAttributes, type MouseEventHandler, type PropsWithChildren, useContext } from "react"
import { RouteContext } from "../../context"

export function Link({ to, onClick, ...props }: PropsWithChildren<Omit<HTMLAttributes<HTMLAnchorElement>, "href"> & { to: string }>) {
  const { historyStore } = useContext(RouteContext)
  const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault()
    onClick?.(e)
    historyStore.goTo(e.currentTarget.href)
  }

  return (
    <a href={to} {...props} onClick={handleClick} />
  )
}