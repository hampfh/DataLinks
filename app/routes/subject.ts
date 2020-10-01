import express from "express"
import { Subject } from "../controllers"


const router = express.Router({
	strict: true
})

router.post("/", Subject.create)
router.get("/", Subject.read)

export default router