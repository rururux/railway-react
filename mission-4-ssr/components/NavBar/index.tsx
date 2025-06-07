import { Link } from "wouter"

export function NavBar() {
  return (
    <nav className="flex gap-4 bg-white font-bold px-8 py-6 rounded-b-4xl">
      <Link href="/">Home</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/qwerty">???</Link>
    </nav>
  )
}