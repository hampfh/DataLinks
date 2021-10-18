import express from "express"
import { MetaTagPopulator } from "../controllers"

const router = express.Router({
	strict: true,
	caseSensitive: true
})

router.get("/", MetaTagPopulator.populateLandingPage)
router.get("/:program([\\dA-Za-z]{3})", MetaTagPopulator.populateProgram)
router.get("/:program([\\dA-Za-z]{3})/course/:courseCode", MetaTagPopulator.populateSubject)
router.get("/:program([\\dA-Za-z]{3})/deadlines", MetaTagPopulator.populateDeadlines)
router.get("/:program([\\dA-Za-z]{3})/contributors", MetaTagPopulator.populateContributors)
router.get("/:program([\\dA-Za-z]{3})/archive", MetaTagPopulator.populateArchives)

export default router