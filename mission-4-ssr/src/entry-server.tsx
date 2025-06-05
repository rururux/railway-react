// https://react.dev/reference/react-dom/server/renderToPipeableStream#usage

import { renderToPipeableStream } from "react-dom/server"
import App from "./App"
import type { Response } from "express"

export async function render(path: string, response: Response) {
  // `onShellReady()` が呼ばれるまで待つ
  const { promise, resolve } = Promise.withResolvers<void>()
  const { pipe } = renderToPipeableStream(<App path={path} />, {
    bootstrapScripts: ["entry-client.tsx"],
    onShellReady() {
      pipe(response)
      resolve()
    }
  })

  return promise
}