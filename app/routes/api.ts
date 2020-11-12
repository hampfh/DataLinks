import express from "express"
import { Content, Group, Subject, Contributors } from "../controllers"

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
router.patch("/subject", Subject.update)
router.delete("/subject", Subject.delete)
router.post("/group", Group.create)
router.get("/group", Group.read)
router.patch("/group", Group.update)
router.delete("/group", Group.delete)
router.post("/group/textcontent", Content.createText)
router.post("/group/linkcontent", Content.createLink)
router.post("/group/deadlinecontent", Content.createDeadline)
router.patch("/group/textcontent", Content.updateText)
router.patch("/group/linkcontent", Content.updateLink)
router.patch("/group/deadlinecontent", Content.updateDeadline)
//router.post("/group/groupcontent", Content.createGroup)
router.get("/group/content", Content.read)
router.delete("/group/content", Content.delete)
router.post("/contributor/name", Contributors.nameContributor)
router.get("/contributors", Contributors.getContributors)

export default router