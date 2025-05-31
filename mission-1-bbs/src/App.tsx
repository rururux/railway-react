import { Layout } from "./components/layout"
import { Route, Routes } from "./components/router"
import { ThreadsContext, useThreadsContext } from "./hooks/useThreads"
import CreateThreadPage from "./pages/createThread"
import IndexPage from "./pages/index"
import { ThreadPage } from "./pages/thread"

export default function BBS() {
  const threadsContextData = useThreadsContext()

  return (
    <ThreadsContext.Provider value={threadsContextData}>
      <Routes>
        <Layout>
          <Route path="/" element={<IndexPage />} />
          <Route path="/threads/new" element={<CreateThreadPage />} />
          <Route path="/threads/:thread_id" element={<ThreadPage />} />
        </Layout>
      </Routes>
    </ThreadsContext.Provider>
  )
}