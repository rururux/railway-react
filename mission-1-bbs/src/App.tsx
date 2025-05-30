import { useEffect } from "react"
import { Layout } from "./components/layout"
import { useBBSApi } from "./hooks/useBBSApi"

export default function BBS() {
  const { data, error, isLoading } = useBBSApi("/threads")

  useEffect(() => {
    console.log([data, error, isLoading])
  }, [ data, error, isLoading ])

  return (
    <Layout>
      <div>
        {data !== undefined && (
          <ol>
            {data.map(thread => (
              <li>{thread.title}</li>
            ))}
          </ol>
        )}
      </div>
    </Layout>
  )
}