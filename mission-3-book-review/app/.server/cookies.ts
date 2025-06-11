import { createCookie } from "react-router"

export const authCookie = createCookie("session", {
  secrets: [ import.meta.env.VITE_AUTH_SECRET ]
})