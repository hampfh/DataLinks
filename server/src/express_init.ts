import express from "express"
import { initPassport } from "./utilities/passport_init"
const app = express()
initPassport(app)
export default app