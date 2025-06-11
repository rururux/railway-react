import { expect, test } from "vitest"
import { render } from "vitest-browser-react"
import SignUpPage from "../../../app/routes/signup"
import { createRoutesStub } from "react-router"

test("render", async () => {
  const Stab = createRoutesStub([
    { path: "/signup", Component: SignUpPage }
  ])
  const screen = render(
    <Stab initialEntries={["/signup"]} />
  )

  const nameInput = screen.getByLabelText("ユーザー名")
  const emailInput = screen.getByLabelText("メール")
  const passwordInput = screen.getByLabelText("パスワード")
  const iconInput = screen.getByLabelText("プロフィール画像")

  await expect.element(nameInput).toBeInTheDocument()
  await expect.element(emailInput).toBeInTheDocument()
  await expect.element(passwordInput).toBeInTheDocument()
  await expect.element(iconInput).toBeInTheDocument()
})