/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import "@babel/polyfill"
import "source-map-support/register"
import express from "express"
import cookieParser from "cookie-parser"
import { urlencoded } from "body-parser"
import compression from "compression"
import path from "path"
import cors from "cors"
import WSS from "./wss/wss"
import getConfig from "./util/config-fetcher"
import http from "http"
import videoRouter from "./routes/video"
import queryRouter from "./routes/query-router"
import OperationEE from "./event-emmiters/operation-ee"
import homeRouter from "./routes/home-router"
import testRouter from "./routes/test-router"

const app = express()
const server = http.createServer(app)
const port = getConfig("server:port")
const domain = getConfig("server:host")

app.use(compression())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname)))
app.use(cors())

const operationEE = new OperationEE()

app.set("operationEE", operationEE)

new WSS({ server, operationEE }).attachEventHandlers()

app.use("/", homeRouter)

app.use("/test", testRouter)

app.use("/video", urlencoded({ extended: true }), videoRouter)

app.use("/query", queryRouter)

server.listen(port, () => {
  console.log(`Application is online at ${domain}:${port}`)
})
