import type { z } from "zod/v4"
import { useForm as useRHFForm, type FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export function useForm<Value extends FieldValues, T extends z.ZodType<Value, Value> = z.ZodType<Value, Value>>({ schema }: { schema: T }) {
  return useRHFForm<Value>({
    resolver: zodResolver<Value, unknown, Value>(schema)
  })
}