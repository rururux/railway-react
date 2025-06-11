import { z } from "zod/v4"

export const LoginSchema = z.strictObject({
  email: z.email("正しいメールアドレスを入力してください"),
  password: z.string({ message: "パスワードを入力してください" }).min(7, "最低7文字以上は入力してください")
})