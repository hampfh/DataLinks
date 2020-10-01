import express from "express"
import Subject from "./subject"

const router = express.Router({
	strict: true
})

router.all("/", (req: express.Request, res: express.Response) => {
	res.status(200).json({
		message: "Welcome to datasektionen.link API"
	})
})

router.use("/subject", Subject)

export default router