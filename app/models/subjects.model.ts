import Mongoose from "mongoose"
import { IGroup } from "./group.model"
import database from "./index.model"
const Schema = database.Schema

export interface ISubject {
	name: string,
	code: string,
	description: string,
	color: string,
	placement: Number,
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
	description: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: true
	},
	placement: {
		type: Number,
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