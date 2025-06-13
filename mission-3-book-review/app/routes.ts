import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login/index.tsx"),
  route("/logout", "routes/logout/index.tsx"),
  route("/signup", "routes/signup/index.tsx"),
  route("/home", "routes/home/index.tsx"),
  route("/profile", "routes/profile/index.tsx"),
  route("/new", "routes/new/index.tsx"),
] satisfies RouteConfig
