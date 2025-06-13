import { Link, useSubmit } from "react-router"

export function Header() {
  const submit = useSubmit()
  const handleClick = () => {
    submit(null, { action: "/logout", method: "POST", navigate: true })
  }

  return (
    <header className="h-16 px-8 bg-blue-600 flex items-center justify-end gap-6 font-bold">
      <Link className="text-white" to="/profile">ユーザー情報</Link>
      <button className="text-red-300 cursor-pointer" onClick={handleClick}>ログアウト</button>
    </header>
  )
}