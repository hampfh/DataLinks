import express from "express"
import { Content, Group, Subject } from "../controllers"

const router = express.Router({
	strict: true
})

router.all("/", (req: express.Request, res: express.Response) => {
	res.status(200).json({
		message: "Welcome to datasektionen.link API"
	})
})

router.post("/subject", Subject.create)
router.get("/subject", Subject.read)
router.delete("/subject", Subject.delete)
router.post("/group", Group.create)
router.get("/group", Group.read)
router.delete("/group", Group.delete)
router.post("/group/textcontent", Content.createText)
router.post("/group/linkcontent", Content.createLink)
//router.post("/group/groupcontent", Content.createGroup)
router.get("/group/content", Content.read)
router.delete("/group/content", Content.delete)

export default router