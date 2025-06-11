import type { ZodError } from "zod/v4"

export default function createRHFErrorData(e: ZodError) {
  return e
    .issues
    .reduce<{ errors: Record<string, string>[] }>(
      (prv, cur) => (cur.path.length > 0)? { errors: [ ...prv.errors, { [cur.path[0]]: cur.message } ] } : prv,
      { errors: [] }
    )
}