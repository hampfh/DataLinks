import express from "express"
import { oidc } from "../utilities/OpenId"
import { MetaTagPopulator } from "../controllers"
import { paramRedirect, updateLoginStats } from "../middlewares/auth"

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
router.get("/login", oidc.login, updateLoginStats, paramRedirect)
router.get("/logout", (_, res, next) => {
	res.clearCookie("connect.sid")
	next()
}, oidc.logout)


export default router