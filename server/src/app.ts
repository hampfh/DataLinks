import logger from "morgan"
import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"
import path from "path"
import apiRoute from "./routes/api"
import apiPublic from "./routes/public"

const app = express()

if (process.env.NODE_ENV === "production")
	app.use(logger("common"))
else
	app.use(logger("dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use("/api/v1", apiRoute)
app.use("/", apiPublic)

app.use(express.static(path.join(path.resolve(), "../client/dist")))

// Redirect www to non-www
app.use(function (req: Request, res: Response, next: express.NextFunction) {
	if (req.headers.host !== undefined && req.headers.host.match(/^www/))
		res.redirect("http://" + req.headers.host.replace(/^www\./, "") + req.url, 301)
	next()
})


/// Error handler
app.use(function (error: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) {
	if (res.headersSent)
		next(error)

	console.error(error)
})

export default app