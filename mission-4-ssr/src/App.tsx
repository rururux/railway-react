import { Route, Router, Switch } from "wouter"
import { Layout } from "../components/Layout"
import { NavBar } from "../components/NavBar"
import HomePage from "../pages/home"
import ProfilePage from "../pages/profile"
import NotFoundPage from "../pages/404"

export default function App({ path }: { path?: string }) {
  return (
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
  )
}