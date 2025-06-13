import { redirect } from "react-router"
import { authCookie } from "~/.server/cookies"

export async function action() {
  return redirect("/login", { headers: { "Set-Cookie": await authCookie.serialize(null) } })
}