import { useEffect, useId, useState, type ChangeEventHandler } from "react"
import { Link, redirect, useActionData, useSubmit } from "react-router"
import { ZodError } from "zod/v4"
import type { Route } from "./+types"
import { useForm } from "../../hooks/useForm"
import { SignUpSchema, type SignUpSchemaValue } from "../../schemas"
import createRHFErrorData from "../../utils/createRHFErrorData"
import Compressor from "compressorjs"
import { authCookie } from "~/.server/cookies"

export async function loader({ request }: Route.LoaderArgs) {
  const cookies = request.headers.get("Cookie")
  const token = await authCookie.parse(cookies)

  if (token === null) return

  // token が生きてるかの確認はあとで行う
  return redirect("/home")
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const requestFormData = await request.formData()
    const requestData = Array.from(requestFormData.entries()).reduce((prv, cur) => {
      return { ...prv, [cur[0]]: cur[1] }
    }, {} as { [key: string]: unknown })
    const result = SignUpSchema.parse(requestData)
    const { icon, ...userData } = result

    const signUpResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    })
    const signUpResponseData = await signUpResponse.json()

    if (signUpResponse.ok !== true || "token" in signUpResponseData !== true) {
      console.error(signUpResponseData)
      throw new Error()
    }

    const formData = new FormData()

    formData.append("icon", icon)

    const uploadImageResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/uploads`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${signUpResponseData.token}`,
        "Content-Type": "application/xxx"
      },
      body: formData
    })

    if (uploadImageResponse.ok !== true) {
      const uploadImageResponseData = await uploadImageResponse.json()

      console.error(uploadImageResponseData)
      throw new Error()
    }

    return redirect("/home", { headers: { "Set-Cookie": await authCookie.serialize(signUpResponseData.token) } })
  } catch (e) {
    if (e instanceof ZodError) {
      return createRHFErrorData(e)
    } else {
      return { errors: [ { root: "unknown server error" } ] }
    }
  }
}

export default function SignUpPage() {
  const actionData = useActionData<typeof action>()
  const [ noValidate, setNoValidate ] = useState(false)
  const _onSubmit = useSubmit()
  const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm<SignUpSchemaValue>({ schema: SignUpSchema })
  const nameInputId = useId()
  const emailInputId = useId()
  const passwordInputId = useId()
  const iconInputId = useId()

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    if (e.currentTarget.files === null) return

    const files = Array.from(e.currentTarget.files)
    setValue("icon", files[0])
  }

  const onSubmit = (data: SignUpSchemaValue) => {
    ;(async () => {
      const compressedFile = await new Promise<Blob>(r => new Compressor(data.icon, { success: r }))
      const formData = Object.entries(data).reduce((prv, cur) => {
        if (cur[0] !== "icon") {
          prv.append(cur[0], cur[1])
        } else {
          prv.append(cur[0], compressedFile)
        }

        return prv
      }, new FormData())

      _onSubmit(formData, { method: "POST", encType: "multipart/form-data" })
    })()
  }

  useEffect(() => {
    if (actionData === undefined) return

    actionData.errors.forEach(error =>
      Object.entries(error).forEach(([ key, value ]) => setError(key as ("root" | keyof SignUpSchemaValue), { type: "custom", message: value }))
    )
  }, [ actionData, setError ])

  // hydoration するまでは HTML デフォルトのバリデーションを使い、
  // hydoration 後はリッチな JS バリデーションを行う
  useEffect(() => setNoValidate(true), [])

  return (
    <div className="h-dvh grid place-items-center">
      <div className="flex flex-col gap-4">
        <form className="w-md rounded-md flex flex-col px-4 py-6 gap-4 border-gray-500 border-2" noValidate={noValidate} onSubmit={handleSubmit(onSubmit)}>
          {errors.root && <span className="text-red-500">{errors.root.message}</span>}
          <div className="grid gap-2">
            <label htmlFor={nameInputId}>ユーザー名:</label>
            <input id={nameInputId} className="bg-white px-2 py-1 rounded-sm border-2 border-gray-400" type="text" required {...register("name")} />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
          </div>
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
          <div className="grid gap-2">
            <label htmlFor={iconInputId}>プロフィール画像:</label>
            <input id={iconInputId} className="bg-white px-2 py-1 rounded-sm border-2 border-gray-400" type="file" accept="image/*" required onChange={handleChange} />
            {errors.icon && <span className="text-red-500">{errors.icon.message}</span>}
          </div>
          <button className="text-blue-600 border-2 border-blue-600 font-bold w-fit px-8 py-2 rounded-sm">登録</button>
        </form>
        <Link className="text-white bg-blue-600 font-bold w-fit px-4 py-2 rounded-sm self-start" to="/login">&lt; ログイン</Link>
      </div>
    </div>
  )
}