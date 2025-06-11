import { createRoutesStub } from "react-router"
import { expect, test } from "vitest"
import { render } from "vitest-browser-react"
import SignUpPage from "../../../app/routes/signup"
import createRHFErrorData from "../../../app/utils/createRHFErrorData"
import { ZodError } from "zod/v4"
import { SignUpSchema } from "../../../app/schemas"

test("required", async () => {
  const Stab = createRoutesStub([
    { path: "/signup", Component: SignUpPage }
  ])
  const screen = render(
    <Stab initialEntries={["/signup"]} />
  )

  const nameInput = screen.getByLabelText("ユーザー名")
  const submitButton = screen.getByRole("button", { name: "登録" })

  await expect.element(nameInput).toBeInTheDocument()
  await expect.element(submitButton).toBeInTheDocument()

  await submitButton.click()

  // submit 失敗
  await expect.element(nameInput).toHaveFocus()
  await expect.element(screen.getByText("ユーザー名を入力してください")).toBeInTheDocument()
  await expect.element(screen.getByText("メールアドレスを入力してください")).toBeInTheDocument()
  await expect.element(screen.getByText("最低7文字以上は入力してください")).toBeInTheDocument()
  await expect.element(screen.getByText("プロフィール画像を設定してください")).toBeInTheDocument()
})

test("validation", async () => {
  const Stab = createRoutesStub([
    {
      path: "/signup",
      Component: SignUpPage,
      async action({ request }) {
        try {
          const requestData = await request.json()

          SignUpSchema.parse(requestData)
        } catch (e) {
          if (e instanceof ZodError) {
            return createRHFErrorData(e)
          } else {
            return { errors: [ { root: "unknown server error" } ] }
          }
        }
      }
    }
  ])
  const screen = render(
    <Stab initialEntries={["/signup"]} />
  )

  const nameInput = screen.getByLabelText("ユーザー名")
  const emailInput = screen.getByLabelText("メール")
  const passwordInput = screen.getByLabelText("パスワード")
  const iconInput = screen.getByLabelText("プロフィール画像")
  const submitButton = screen.getByRole("button", { name: "登録" })

  await expect.element(nameInput).toBeInTheDocument()
  await expect.element(emailInput).toBeInTheDocument()
  await expect.element(passwordInput).toBeInTheDocument()
  await expect.element(iconInput).toBeInTheDocument()
  await expect.element(submitButton).toBeInTheDocument()

  await submitButton.click()

  // submit 失敗
  await expect.element(screen.getByText("ユーザー名を入力してください")).toBeInTheDocument()

  await nameInput.fill("userName")
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

  // submit 失敗
  await expect.element(screen.getByText("プロフィール画像を設定してください")).toBeInTheDocument()

  await iconInput.upload(new File([], "test.jpg", { type: "image/jpeg" }))
  await submitButton.click()

  // submit 成功
  await expect.element(submitButton).toHaveFocus()
})