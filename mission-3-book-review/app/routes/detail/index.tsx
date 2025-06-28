import type { Route } from "./+types"
import { redirect, useLoaderData, useSubmit } from "react-router"
import { Layout } from "~/components/Layout"
import { Suspense, use, useEffect, useId, useState } from "react"
import { BookReviewSchema, type BookReviewSchemaType } from "~/schemas"
import { useForm } from "~/hooks/useForm"
import checkAuth from "~/utils/checkAuth.server"
import { ZodError } from "zod/v4"
import createRHFErrorData from "~/utils/createRHFErrorData"

type BookReview = BookReviewSchemaType & {
  reviewer: string
  isMine: boolean
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const token = await checkAuth(request)

  const response = fetch(`${import.meta.env.VITE_API_BASE_URL}/books/${params.id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  }).then(r => r.json())

  return {
    reviewPromise: response
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  const token = await checkAuth(request)

  try {
    switch (request.method) {
      case "PUT": {
        const result = BookReviewSchema.parse(await request.json())

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/books/${params.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(result)
        })
        const responseData = await response.json()

        if (response.ok !== true) {
          console.error(responseData)

          throw new Error()
        }

        return responseData
      }

      case "DELETE": {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/books/${params.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })

        if (response.ok !== true) {
          const responseData = await response.json()
          console.error(responseData)

          throw new Error("")
        }

        return redirect("/home")
      }

      default: {
        return null
      }
    }
  } catch (e) {
    if (e instanceof ZodError) {
      return createRHFErrorData(e)
    } else {
      return { errors: [ { root: "unknown server error" } ] }
    }
  }
}

export default function ReviewDetailPage() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <Layout>
      <div className="w-lg self-center p-4 border-2 border-gray-400 rounded-md">
        <Suspense fallback={"Loading..."}>
          <ReviewDetail reviewPromise={loaderData.reviewPromise} />
        </Suspense>
      </div>
    </Layout>
  )
}

function ReviewDetail({ reviewPromise }: { reviewPromise: Promise<BookReview> }) {
  const review = use(reviewPromise)
  const [ isEditMode, setIsEditMode ] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<BookReviewSchemaType>({
    schema: BookReviewSchema,
    defaultValues: {
      title: review.title,
      url: review.url,
      detail: review.detail,
      review: review.review
    }
  })
  const submit = useSubmit()
  const titleInputId = useId()
  const urlInputId = useId()
  const detailInputId = useId()
  const reviewInputId = useId()

  const handleEditButtonClick = () => setIsEditMode(cur => !cur)
  const handleDeleteButtonClick = () => submit(null, { method: "DELETE" })

  const onSubmit = (data: BookReviewSchemaType) => submit(data, { method: "PUT", encType: "application/json" })

  useEffect(() => console.log(errors), [ errors ])

  return (
    <div className="grid">
      <title>レビュー詳細</title>
      <meta name="description" content="レビュー詳細画面です。" />
      <form className="grid gap-x-2 gap-y-4 grid-cols-[minmax(0,_auto)_1fr]" method="PUT" onSubmit={handleSubmit(onSubmit)}>
        {review.isMine && (
          <div className="flex gap-2 justify-end col-start-1 col-span-2">
            <button className="text-blue-600 border-2 border-blue-600 font-bold w-fit px-2 py-1 rounded-sm justify-self-end" onClick={handleEditButtonClick}>編集</button>
            <button className="text-red-600 border-2 border-red-600 font-bold w-fit px-2 py-1 rounded-sm justify-self-end" onClick={handleDeleteButtonClick}>削除</button>
          </div>
        )}
        <div className="contents">
          {isEditMode? (
            <>
              <label className="justify-self-end" htmlFor={titleInputId}>本のタイトル:</label>
              <input id={titleInputId} className="px-2 py-1 outline-2 outline-gray-500 rounded-sm" type="text" {...register("title", { required: true })} />
            </>
          ) : (
            <>
              <span className="justify-self-end">本のタイトル:</span>
              <span>{review.title}</span>
            </>
          )}
        </div>
        <div className="contents">
          {isEditMode? (
            <>
              <label className="justify-self-end" htmlFor={urlInputId}>URL:</label>
              <input id={urlInputId} className="px-2 py-1 outline-2 outline-gray-500 rounded-sm" type="text" {...register("url", { required: true })} />
            </>
          ) : (
            <>
              <span className="justify-self-end">URL:</span>
              <span>{review.url}</span>
            </>
          )}
        </div>
        <div className="contents">
          {isEditMode? (
            <>
              <label className="justify-self-end" htmlFor={detailInputId}>詳細:</label>
              <input id={detailInputId} className="px-2 py-1 outline-2 outline-gray-500 rounded-sm" type="text" {...register("detail", { required: true })} />
            </>
          ) : (
            <>
              <span className="justify-self-end">詳細:</span>
              <span>{review.detail}</span>
            </>
          )}
        </div>
        <div className="contents">
          {isEditMode? (
            <>
              <label className="align-top justify-self-end" htmlFor={reviewInputId}>レビュー:</label>
              <input id={reviewInputId} className="px-2 py-1 outline-2 outline-gray-500 rounded-sm h-28" type="text" {...register("review", { required: true })}></input>
            </>
          ) : (
            <>
              <span className="justify-self-end">レビュー:</span>
              <span>{review.review}</span>
            </>
          )}
        </div>
        {isEditMode && <button className="col-start-2 mt-4 w-fit px-4 py-2 text-white bg-blue-600 rounded-sm justify-self-end disabled:text-black disabled:bg-gray-400">保存</button>}
      </form>
    </div>
  )
}