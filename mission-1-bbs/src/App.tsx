import { Layout } from "./components/layout"
import { Route, Routes } from "./components/router"
import IndexPage from "./pages/index"

export default function BBS() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<IndexPage />} />
      </Routes>
    </Layout>
  )
}