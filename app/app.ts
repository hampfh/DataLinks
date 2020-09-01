import logger from "morgan"
import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"
import path from "path"
import oldData from "./assets/data.json"
import fs from "fs"

const app = express()

if (process.env.NODE_ENV === "production")
	app.use(logger("common"))
else
	app.use(logger("dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.static(path.join(path.resolve(), "client/build")))

// Redirect www to non-www
app.use(function (req, res, next) {
	if (req.headers.host !== undefined && req.headers.host.match(/^www/))
		res.redirect("http://" + req.headers.host.replace(/^www\./, "") + req.url, 301)
	next()
})

app.get("/data", (req: Request, res: Response) => {
	try {
		const stream = fs.createReadStream("./app/assets/data.json")
		stream.on("data", (data) => {
			let chunk = data.toString()
			res.json({
				data: JSON.parse(chunk)
			})
		})
	} catch (err) {
		res.json({
			data: oldData
		})
	}
})

// Serve to react
app.get("*", (req: express.Request, res: express.Response) => {
	res.sendFile(path.join(path.resolve() + "/client/build/index.html"))
})

/// Error handler
app.use(function (error: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) {
	if (res.headersSent)
		next(error)

	console.error(error)
})

export default app