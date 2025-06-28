import type { Route } from "./+types"
import { useEffect, useId, useState } from "react"
import { Link, redirect, useActionData, useSubmit } from "react-router"
import { ZodError } from "zod/v4"
import { useForm } from "../../hooks/useForm"
import { LoginSchema, type LoginSchemaValue } from "../../schemas"
import createRHFErrorData from "../../utils/createRHFErrorData"
import { authCookie } from "../../.server/cookies"

export async function loader({ request }: Route.LoaderArgs) {
  const cookies = request.headers.get("Cookie")
  const token = await authCookie.parse(cookies)

  if (token === null) return

  // token が生きてるかの確認はあとで行う
  return redirect("/home")
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const requestData = await request.json()
    const result = LoginSchema.parse(requestData)

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    })

    const responseData = await response.json()

    if (response.ok !== true || "token" in responseData !== true) {
      console.error(responseData)
      throw new Error()
    }

    return redirect("/home", { headers: { "Set-Cookie": await authCookie.serialize(responseData.token) } })
  } catch (e) {
    if (e instanceof ZodError) {
      return createRHFErrorData(e)
    } else {
      return { errors: [ { root: "unknown server error" } ] }
    }
  }
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>()
  const [ noValidate, setNoValidate ] = useState(false)
  const _onSubmit = useSubmit()
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginSchemaValue>({ schema: LoginSchema })
  const emailInputId = useId()
  const passwordInputId = useId()

  const onSubmit = (data: LoginSchemaValue) => _onSubmit(data, { method: "POST", encType: "application/json" })

  useEffect(() => {
    if (actionData === undefined) return

    actionData.errors.forEach(error =>
      Object.entries(error).forEach(([ key, value ]) => setError(key as ("root" | "email" | "password"), { type: "custom", message: value }))
    )
  }, [ actionData, setError ])

  // hydoration するまでは HTML デフォルトのバリデーションを使い、
  // hydoration 後はリッチな JS バリデーションを行う
  useEffect(() => setNoValidate(true), [])

  return (
    <div className="h-dvh grid place-items-center">
      <title>ログイン</title>
      <meta name="description" content="ログイン画面です。" />
      <div className="flex flex-col gap-4">
        <form className="w-md rounded-md flex flex-col px-4 py-6 gap-4 border-gray-500 border-2" noValidate={noValidate} onSubmit={handleSubmit(onSubmit)}>
          {errors.root && <span className="text-red-500">{errors.root.message}</span>}
          <div className="grid gap-2">
            <label htmlFor={emailInputId}>メール:</label>
            <input id={emailInputId} className="bg-white px-2 py-1 rounded-sm border-2 border-gray-400" type="email" {...register("email")} />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </div>
          <div className="grid gap-2">
            <label htmlFor={passwordInputId}>パスワード:</label>
            <input id={passwordInputId} className="bg-white px-2 py-1 rounded-sm border-2 border-gray-400" type="password" minLength={7} {...register("password")} />
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>
          <button className="text-white bg-blue-600 font-bold w-fit px-8 py-2 rounded-sm">ログイン</button>
        </form>
        <Link className="text-blue-600 border-2 border-blue-600 font-bold w-fit px-4 py-2 rounded-sm self-end" to="/signup">新規登録 &gt;</Link>
      </div>
    </div>
  )
}