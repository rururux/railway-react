import { expect, test } from "vitest"
import { render } from "vitest-browser-react"
import LoginPage from "../../../app/routes/login"
import { createRoutesStub } from "react-router"
import { LoginSchema } from "../../../app/schemas"
import { ZodError } from "zod/v4"

test("required", async () => {
  const Stab = createRoutesStub([
    { path: "/login", Component: LoginPage }
  ])
  const screen = render(
    <Stab initialEntries={["/login"]} />
  )

  const emailInput = screen.getByLabelText("メール")
  const submitButton = screen.getByRole("button")

  await expect.element(emailInput).toBeInTheDocument()
  await expect.element(submitButton).toBeInTheDocument()

  await submitButton.click()

  // submit 失敗
  await expect.element(emailInput).toHaveFocus()
  await expect.element(screen.getByText("正しいメールアドレスを入力してください")).toBeInTheDocument()
  await expect.element(screen.getByText("最低7文字以上は入力してください")).toBeInTheDocument()
})

test("validation", async () => {
  const Stab = createRoutesStub([
    {
      path: "/login",
      Component: LoginPage,
      async action({ request }) {
        try {
          const requestData = await request.json()

          LoginSchema.parse(requestData)
        } catch (e) {
          if (e instanceof ZodError) {
            return e
              .issues
              .reduce<{ errors: Record<string, string>[] }>(
                (prv, cur) => (cur.path.length > 0)? { errors: [ ...prv.errors, { [cur.path[0]]: cur.message } ] } : prv,
                { errors: [] }
              )
          } else {
            return { errors: [ { root: "unknown server error" } ] }
          }
        }
      }
    }
  ])
  const screen = render(
    <Stab initialEntries={["/login"]} />
  )

  const emailInput = screen.getByLabelText("メール")
  const passwordInput = screen.getByLabelText("パスワード")
  const submitButton = screen.getByRole("button")

  await expect.element(emailInput).toBeInTheDocument()
  await expect.element(passwordInput).toBeInTheDocument()
  await expect.element(submitButton).toBeInTheDocument()

  await emailInput.fill("invalidmail")
  await submitButton.click()

  // submit 失敗
  await expect.element(screen.getByText("正しいメールアドレスを入力してください")).toBeInTheDocument()

  await emailInput.fill("validmail@example.com")
  await submitButton.click()

  // submit 失敗
  await expect.element(screen.getByText("最低7文字以上は入力してください")).toBeInTheDocument()

  await passwordInput.fill("sample-password")
  await submitButton.click()

  // submit 成功
  await expect.element(submitButton).toHaveFocus()
})