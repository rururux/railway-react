import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import type { Quote } from "../types.ts"

declare global {
  // eslint-disable-next-line no-var
  var __INITIAL_QUOTE__: Quote | null
}

hydrateRoot(document.getElementById('root')!,
  <StrictMode>
    <App initialQuote={window.__INITIAL_QUOTE__} />
  </StrictMode>
)
