// https://ja.vite.dev/guide/ssr.html

import fs from "node:fs/promises"
import express, { type Response } from "express"
import type { ViteDevServer } from "vite"

const isProduction = process.env.NODE_ENV === "production"

;(async () => {
  const app = express()
  let vite: ViteDevServer

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
      let render: (res: Response) => Promise<void>

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

      res.status(200).set({ "Content-Type": "text/html" })
      res.write(htmlParts[0])
      await render(res)
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