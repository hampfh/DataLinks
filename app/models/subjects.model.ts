import Mongoose from "mongoose"
import { GroupSchema, IGroup } from "./group.model"
import database from "./index.model"
const Schema = database.Schema

export interface ISubject {
	name: string,
	code: string,
	description: string,
	logo: string,
	color: string,
	group: IGroup
}

export const SubjectSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true
	},
	archived: {
		type: Boolean,
		required: true
	},
	description: {
		type: String,
		required: true,
	},
	logo: {
		type: String,
		required: true
	},
	color: {
		type: String,
		required: true
	},
	group: {
		type: Mongoose.Types.ObjectId,
		ref: "group"
	}
}, {
	timestamps: true
})

export default database.model("subject", SubjectSchema)