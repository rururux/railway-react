import { type FormEventHandler, useId } from "react"

export default function LoginPage() {
  const emailInputId = useId()
  const passwordInputId = useId()

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault()
  }

  return (
    <div className="h-dvh grid place-items-center">
      <form className="w-md rounded-md flex flex-col px-4 py-6 gap-4 border-gray-500 border-2" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label htmlFor={emailInputId}>メール:</label>
          <input id={emailInputId} className="bg-white px-2 py-1 rounded-sm border-2 border-gray-400" type="email" name="email" required />
        </div>
        <div className="grid gap-2">
          <label htmlFor={passwordInputId}>パスワード:</label>
          <input id={passwordInputId} className="bg-white px-2 py-1 rounded-sm border-2 border-gray-400" type="password" name="password" required />
        </div>
        <button className="text-white bg-blue-600 w-fit px-8 py-2 rounded-sm">ログイン</button>
      </form>
    </div>
  )
}