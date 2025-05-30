import { Layout } from "./components/layout"
import { Route, Routes } from "./components/router"
import CreateThreadPage from "./pages/createThread"
import IndexPage from "./pages/index"

export default function BBS() {
  return (
    <Routes>
      <Layout>
        <Route path="/" element={<IndexPage />} />
        <Route path="/threads/new" element={<CreateThreadPage />} />
      </Layout>
    </Routes>
  )
}