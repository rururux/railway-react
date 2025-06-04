import express from "express"

const app = express()

app.use(express.static("./mission-4-ssr/dist"))

app.listen(3000)