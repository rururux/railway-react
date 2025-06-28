import { Link, useSubmit } from "react-router"

export function Header({ isLoggined = true }: { isLoggined?: boolean }) {
  const submit = useSubmit()
  const handleClick = () => {
    submit(null, { action: "/logout", method: "POST", navigate: true })
  }

  return (
    <header className="h-16 px-8 bg-blue-600 flex items-center justify-end gap-6 font-bold">
      {isLoggined && (
        <>
          <Link className="text-white" to="/profile">ユーザー情報</Link>
          <Link className="text-white" to="/new">新規作成</Link>
          <button className="px-3 py-1 text-white bg-red-600 cursor-pointer rounded-md" onClick={handleClick}>ログアウト</button>
        </>
      )}
    </header>
  )
}