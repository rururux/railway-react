import { Route, Router, Switch } from "wouter"
import { Layout } from "../components/Layout"
import { NavBar } from "../components/NavBar"
import HomePage from "../pages/home"
import ProfilePage from "../pages/profile"
import NotFoundPage from "../pages/404"
import type { Quote } from "../types"
import { useState } from "react"
import { QuoteContext } from "../context/QuoteContext"

export default function App({ path, initialQuote }: { path?: string, initialQuote: Quote | null }) {
  const [ quote, setQuote ] = useState(initialQuote)

  return (
    <QuoteContext.Provider value={{ quote, setQuote }}>
      <Router ssrPath={path}>
        <Layout>
          <NavBar />
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/profile" component={ProfilePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Layout>
      </Router>
    </QuoteContext.Provider>
  )
}