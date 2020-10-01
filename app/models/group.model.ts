import { Mongoose } from "mongoose"
import database from "./index.model"
const Schema = database.Schema

export const LinkSchema = new Schema({
	displayText: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	}
})

export const TextSchema = new Schema({
	title: {
		type: String
	},
	text: {
		type: String,
		required: true
	}
}) 

export const ContentSchema = new Schema({
	link: LinkSchema,
	text: TextSchema,
	group: {
		type: Schema.Types.ObjectId,
		ref: "group"
	}
})

export const GroupSchema = new Schema({
	split: Boolean,
	column: Boolean,
	content: [ContentSchema]
})

export default database.model("group", GroupSchema)