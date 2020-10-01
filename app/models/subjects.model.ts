import Mongoose from "mongoose"
import { GroupSchema } from "./group.model"
import database from "./index.model"
const Schema = database.Schema

export const SubjectSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: true
	},
	group: {
		type: Mongoose.Types.ObjectId,
		ref: "group"
	}
})

export default database.model("subject", SubjectSchema)