// https://ja.vite.dev/guide/ssr.html

import fs from "node:fs/promises"
import express, { type Response } from "express"
import type { ViteDevServer } from "vite"
import type { Quote } from "./types.js"
import sanitizeHtml from "sanitize-html"

const isProduction = process.env.NODE_ENV === "production"

async function getQuote() {
  const meigens = await fetch("https://meigen.doodlenote.net/api/json.php").then<{ meigen: string, auther: string }[]>(r => r.json())

  return meigens[0]
}

function is404(path: string) {
  return !([ "/", "/profile" ].includes(path))
}

;(async () => {
  const app = express()
  let vite: ViteDevServer

  app.get("/api/quotes", async (_req, res) => {
    const quote = await getQuote()

    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(quote))
  })

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite")
    vite = await createViteServer({
      root: "./mission-4-ssr",
      configFile: "vite.config.ts",
      server: { middlewareMode: true },
      appType: "custom"
    })

    app.use(vite.middlewares)
  } else {
    app.use(express.static("./mission-4-ssr/dist/client"))
  }

  app.use('*all', async (req, res, next) => {
    const url = req.originalUrl

    try {
      let template: string
      let render: (path: string, res: Response, initialQuote: Quote | null) => Promise<void>

      if (!isProduction) {
        template = await fs.readFile("./mission-4-ssr/index.html", "utf-8")
        template = await vite.transformIndexHtml(url, template)

        render = await vite.ssrLoadModule("./mission-4-ssr/src/entry-server.tsx").then(r => r.render)
      } else {
        template = await fs.readFile("./mission-4-ssr/dist/client/index.html", "utf-8")
        // @ts-expect-error あるはず
        render = await import("./mission-4-ssr/dist/server/entry-server.js").then(r => r.render)
      }

      const htmlParts = template.split("<!--ssr-outlet-->")
      let quote = null

      if (is404(req.originalUrl)) {
        quote = await getQuote()
      }

      res.status(200).set({ "Content-Type": "text/html" })
      res.write(htmlParts[0])
      res.write(`<script>window.__INITIAL_QUOTE__ = ${sanitizeHtml(JSON.stringify(quote))};</script>`)
      await render(req.originalUrl, res, quote)
      res.end(htmlParts[1])
    } catch (e) {
      if (e instanceof Error && vite !== undefined) {
        vite.ssrFixStacktrace(e)
      }

      next(e)
    }
  })

  app.listen(3000)
})()