import { createContext, type Dispatch, type SetStateAction } from "react"
import type { Quote } from "../types"

export const QuoteContext = createContext<{
  quote: Quote | null,
  setQuote: Dispatch<SetStateAction<Quote | null>>
}>({ quote: null, setQuote: null! })