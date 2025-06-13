import { authCookie } from "~/.server/cookies"
import type { Route } from "./+types"
import { redirect, useLoaderData } from "react-router"
import { Layout } from "~/components/Layout"
import { Suspense, use } from "react"
import type { BookReviewSchemaType } from "~/schemas"

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookies = request.headers.get("Cookie")
  const token = await authCookie.parse(cookies)

  if (token === null) return redirect("/login")

  const response = fetch(`${import.meta.env.VITE_API_BASE_URL}/books/${params.id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  }).then(r => r.json())

  return {
    reviewPromise: response
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

function ReviewDetail({ reviewPromise }: { reviewPromise: Promise<BookReviewSchemaType> }) {
  const review = use(reviewPromise)

  return (
    <div className="grid gap-x-2 gap-y-4 grid-cols-[minmax(0,_auto)_1fr]">
      <div className="contents">
        <span className="justify-self-end">本のタイトル:</span>
        <span>{review.title}</span>
      </div>
      <div className="contents">
        <span className="justify-self-end">URL:</span>
        <span>{review.url}</span>
      </div>
      <div className="contents">
        <span className="justify-self-end">詳細:</span>
        <span>{review.detail}</span>
      </div>
      <div className="contents">
        <span className="justify-self-end">レビュー:</span>
        <span>{review.review}</span>
      </div>
    </div>
  )
}