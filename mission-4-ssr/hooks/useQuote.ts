import { useCallback, useContext } from "react"
import { QuoteContext } from "../context/QuoteContext"
import type { Quote } from "../types"

export function useQuote() {
  const { quote, setQuote } = useContext(QuoteContext)
  const updateQuote = useCallback(async () => {
    const newQuote = await fetch("/api/quotes").then<Quote>(r => r.json())

    setQuote(newQuote)
  }, [ setQuote ])
  const resetQuote = useCallback(() => {
    setQuote(null)
  }, [ setQuote ])

  return { quote, updateQuote, resetQuote }
}