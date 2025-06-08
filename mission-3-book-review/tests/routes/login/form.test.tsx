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

test("required", async () => {
  const screen = render(
    <LoginPage />
  )

  const emailInput = screen.getByLabelText("メール")
  const submitButton = screen.getByRole("button")

  await expect.element(emailInput).toBeInTheDocument()
  await expect.element(submitButton).toBeInTheDocument()

  await submitButton.click()

  // submit 失敗
  await expect.element(emailInput).toHaveFocus()
})

test("validation", async () => {
  const screen = render(
    <LoginPage />
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
  await expect.element(emailInput).toHaveFocus()

  await emailInput.fill("validmail@example.com")
  await submitButton.click()

  // submit 失敗
  await expect.element(passwordInput).toHaveFocus()

  await passwordInput.fill("sample-password")
  await submitButton.click()

  // submit 成功
  await expect.element(submitButton).toHaveFocus()
})