import type { Quote } from "../../types"

export function Quote({ quote }: { quote: Quote }) {
  return (
    <div className="bg-white rounded-md px-4 py-4 flex flex-col gap-4">
      <span>{quote.meigen}</span>
      <span className="text-gray-600 self-end">──{quote.auther}</span>
    </div>
  )
}