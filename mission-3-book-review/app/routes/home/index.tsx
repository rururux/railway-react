import { Link, useLoaderData, useSearchParams } from "react-router"
import type { Route } from "./+types"
import { useEffect } from "react"
import { Layout } from "~/components/Layout"

type Book = {
  id: string
  title: string
  url: string
  detail: string
  review: string
  reviewer: string
}

export async function loader({ request }: Route.LoaderArgs) {
  const requestUrl = new URL(request.url)
  const offset = Number(requestUrl.searchParams.get("page") ?? 0) * 10
  const books = await fetch(`${import.meta.env.VITE_API_BASE_URL}/public/books?offset=${offset}`).then<Book[]>(r => r.json())

  return { books }
}

export default function HomePage() {
  const loaderData = useLoaderData<typeof loader>()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const page = Number(searchParams.get("page") ?? 0)

  useEffect(() => {
    if (page !== 0) return

    setSearchParams(undefined)
  }, [ page, setSearchParams ])

  return (
    <Layout>
      <div className="grid place-items-center py-8">
        <div className="flex flex-col">
          <ul className="flex flex-col gap-4 max-w-lg">
            {loaderData.books.map(book => (
              <li className="border-2 rounded-md p-4 bg-blue-100" key={book.id}>
                <div>
                  <p>タイトル: {book.title}</p>
                  <p>作品詳細: {book.detail}</p>
                  <p className="overflow-ellipsis whitespace-nowrap">URL: {book.url}</p>
                </div>
                <div className="mt-4">
                  <div className="flex gap-1 items-end">
                    <svg className="text-gray-600" xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z" /></svg>
                    <p className="border-2 rounded-xl p-4 min-w-sm bg-white">{book.review}</p>
                  </div>
                  <p className="text-gray-500">{book.reviewer}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex py-4">
            {page > 0 && <Link className="px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-md" to={`?page=${page - 1}`}>前のページ</Link>}
            <Link className="px-4 py-2 text-white bg-blue-600 rounded-md ml-auto" to={`?page=${page + 1}`}>次のページ</Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}