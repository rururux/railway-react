import { z } from "zod/v4"

export const LoginSchema = z.strictObject({
  email: z.email("正しいメールアドレスを入力してください"),
  password: z.string({ message: "パスワードを入力してください" }).min(7, "最低7文字以上は入力してください")
})
export type LoginSchemaValue = z.infer<typeof LoginSchema>

export const SignUpSchema = z.strictObject({
  ...LoginSchema.shape,
  name: z.string().min(1, "ユーザー名を入力してください"),
  icon: z.file("プロフィール画像を設定してください")
})
export type SignUpSchemaValue = z.infer<typeof SignUpSchema>

export const UserDataSchema = z.strictObject({
  name: z.optional(z.string().min(1)),
  icon: z.optional(z.file())
})
export type UserDataSchemaValue = z.infer<typeof UserDataSchema>

export const BookReviewSchema = z.strictObject({
  title: z.string().min(1),
  url: z.string(),
  detail: z.string().min(1),
  review: z.string().min(1)
})
export type BookReviewSchemaType = z.infer<typeof BookReviewSchema>