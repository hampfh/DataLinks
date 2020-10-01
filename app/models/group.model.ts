import { Mongoose } from "mongoose"
import database from "./index.model"
const Schema = database.Schema

export interface ILink {
	displayText: string,
	link: string
}

export interface IText {
	title?: string,
	text: string
}

export interface IContent {
	_id: string,
	link?: ILink,
	text?: IText,
	group?: IGroup
}

export interface IGroup {
	_id: string,
	split?: boolean,
	column?: boolean,
	content: [IContent]
}

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
	_id: Schema.Types.ObjectId,
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