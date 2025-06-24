import { redirect } from "react-router"
import { authCookie } from "~/.server/cookies"

export default async function checkAuth(request: Request) {
  const cookies = request.headers.get("Cookie")
  const token = await authCookie.parse(cookies)

  if (token === null) throw redirect("/login")

  return token
}