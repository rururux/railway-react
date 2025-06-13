import { useId } from "react"
import { redirect, useSubmit } from "react-router"
import { Layout } from "~/components/Layout"
import { useForm } from "~/hooks/useForm"
import { BookReviewSchema, type BookReviewSchemaType } from "~/schemas"
import type { Route } from "./+types"
import { ZodError } from "zod/v4"
import createRHFErrorData from "~/utils/createRHFErrorData"
import { authCookie } from "~/.server/cookies"

export async function loader({ request }: Route.LoaderArgs) {
  const cookies = request.headers.get("Cookie")
  const token = await authCookie.parse(cookies)

  if (token === null) return redirect("/login")
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const cookies = request.headers.get("Cookie")
    const token = await authCookie.parse(cookies)

    if (token === null) return redirect("/login")

    const result = BookReviewSchema.parse(await request.json())

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/books`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(result)
    })

    if (response.ok !== true) {
      const responseData = await response.json()
      console.error(responseData)

      throw new Error()
    }

    return redirect("/home")
  } catch (e) {
    if (e instanceof ZodError) {
      return createRHFErrorData(e)
    } else {
      return { errors: [ { root: "unknown server error" } ] }
    }
  }
}

export default function CreateReviewPage() {
  const { formState: { isDirty, isValid }, register, handleSubmit } = useForm<BookReviewSchemaType>({ schema: BookReviewSchema })
  const submit = useSubmit()
  const titleInputId = useId()
  const urlInputId = useId()
  const detailInputId = useId()
  const reviewInputId = useId()

  const onSubmit = (data: BookReviewSchemaType) => submit(data, { method: "POST", encType: "application/json" })

  return (
    <Layout>
      <div className="w-lg self-center p-4 border-2 border-gray-400 rounded-md">
        <h2 className="text-2xl mb-4">レビュー作成</h2>
        <form className="grid gap-x-2 gap-y-4 grid-cols-[minmax(0,_auto)_1fr]" onSubmit={handleSubmit(onSubmit)}>
          <div className="contents">
            <label className="justify-self-end" htmlFor={titleInputId}>本のタイトル:</label>
            <input id={titleInputId} className="px-2 py-1 outline-2 outline-gray-500 rounded-sm" type="text" {...register("title", { required: true })} />
          </div>
          <div className="contents">
            <label className="justify-self-end" htmlFor={urlInputId}>URL:</label>
            <input id={urlInputId} className="px-2 py-1 outline-2 outline-gray-500 rounded-sm" type="text" {...register("url", { required: true })} />
          </div>
          <div className="contents">
            <label className="justify-self-end" htmlFor={detailInputId}>詳細:</label>
            <input id={detailInputId} className="px-2 py-1 outline-2 outline-gray-500 rounded-sm" type="text" {...register("detail", { required: true })} />
          </div>
          <div className="contents">
            <label className="align-top justify-self-end" htmlFor={reviewInputId}>レビュー:</label>
            <input id={reviewInputId} className="px-2 py-1 outline-2 outline-gray-500 rounded-sm h-28" type="text" {...register("review", { required: true })}></input>
          </div>
          <button className="col-start-2 mt-4 w-fit px-4 py-2 text-white bg-blue-600 rounded-sm justify-self-end disabled:text-black disabled:bg-gray-400" disabled={!isDirty && isValid}>作成</button>
        </form>
      </div>
    </Layout>
  )
}