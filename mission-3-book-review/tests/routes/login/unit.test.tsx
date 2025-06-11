import { expect, test } from "vitest"
import { render } from "vitest-browser-react"
import LoginPage from "../../../app/routes/login"
import { createRoutesStub } from "react-router"

test("render", async () => {
  const Stab = createRoutesStub([
    { path: "/login", Component: LoginPage }
  ])
  const screen = render(
    <Stab initialEntries={["/login"]} />
  )

  const emailInput = screen.getByLabelText("メール")
  const passwordInput = screen.getByLabelText("パスワード")

  await expect.element(emailInput).toBeInTheDocument()
  await expect.element(passwordInput).toBeInTheDocument()
})