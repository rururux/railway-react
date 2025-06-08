import { expect, test } from "vitest"
import { render } from "vitest-browser-react"
import LoginPage from "../../../app/routes/login"

test("render", async () => {
  const screen = render(
    <LoginPage />
  )

  const emailInput = screen.getByLabelText("メール")
  const passwordInput = screen.getByLabelText("パスワード")

  await expect.element(emailInput).toBeInTheDocument()
  await expect.element(passwordInput).toBeInTheDocument()
})