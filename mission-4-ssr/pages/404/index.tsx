import { useEffect } from "react"
import { Quote } from "../../components/Quote"
import { useQuote } from "../../hooks/useQuote"

export default function NotFoundPage() {
  const { quote, updateQuote, resetQuote } = useQuote()

  useEffect(() => {
    if (quote === null) {
      updateQuote()
    }
  }, [ quote, updateQuote ])

  useEffect(() => {
    return () => resetQuote()
  }, [ resetQuote ])

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-white text-4xl font-bold">404 Not Found!</p>
      {quote !== null && <Quote quote={quote} />}
    </div>
  )
}