import type { Route } from "./+types"
import { useEffect, useId, useState } from "react"
import { useActionData, useSubmit } from "react-router"
import { z, ZodError } from "zod/v4"
import { useForm } from "../../hooks/useForm"
import { LoginSchema } from "../../schemas"

type LoginFormValueType = z.infer<typeof LoginSchema>

export async function action({ request }: Route.ActionArgs) {
  try {
    const requestData = await request.json()
    const result = LoginSchema.parse(requestData)

    const response = await fetch("https://railway.bookreview.techtrain.dev/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    })

    // TODO
  } catch (e) {
    if (e instanceof ZodError) {
      return e
        .issues
        .reduce<{ errors: Record<string, string>[] }>(
          (prv, cur) => (cur.path.length > 0)? { errors: [ ...prv.errors, { [cur.path[0]]: cur.message } ] } : prv,
          { errors: [] }
        )
    } else {
      return { errors: [ { root: "unknown server error" } ] }
    }
  }
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>()
  const [ noValidate, setNoValidate ] = useState(false)
  const _onSubmit = useSubmit()
  const { register, handleSubmit, errors, setError } = useForm<LoginFormValueType>({ schema: LoginSchema })
  const emailInputId = useId()
  const passwordInputId = useId()

  const onSubmit = (data: LoginFormValueType) => _onSubmit(data, { method: "POST", encType: "application/json" })

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
      <form className="w-md rounded-md flex flex-col px-4 py-6 gap-4 border-gray-500 border-2" noValidate={noValidate} onSubmit={handleSubmit(onSubmit)}>
        {errors.root && <span className="text-red-500">{errors.root.message}</span>}
        <div className="grid gap-2">
          <label htmlFor={emailInputId}>メール:</label>
          <input id={emailInputId} className="bg-white px-2 py-1 rounded-sm border-2 border-gray-400" type="email" required {...register("email")} />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </div>
        <div className="grid gap-2">
          <label htmlFor={passwordInputId}>パスワード:</label>
          <input id={passwordInputId} className="bg-white px-2 py-1 rounded-sm border-2 border-gray-400" type="password" required minLength={7} {...register("password")} />
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        </div>
        <button className="text-white bg-blue-600 w-fit px-8 py-2 rounded-sm">ログイン</button>
      </form>
    </div>
  )
}