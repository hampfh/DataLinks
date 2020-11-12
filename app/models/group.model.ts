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

export interface IDeadline {
	displayText: string,
	deadline: Date,
	start: Date
}

export interface IContent {
	_id: string,
	link?: ILink,
	text?: IText,
	deadline?: IDeadline,
	group?: IGroup
}

export interface IGroup {
	_id: string,
	name?: string,
	depth: number
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

export const DeadlineSchema = new Schema({
	displayText: {
		type: String,
		required: true,
	},
	deadline: {
		type: Date,
		required: true,
	},
	start: {
		type: Date,
		required: true,
	}
})

export const ContentSchema = new Schema({
	_id: Schema.Types.ObjectId,
	placement: {
		type: Number,
		required: true
	},
	link: LinkSchema,
	text: TextSchema,
	deadline: DeadlineSchema,
	group: {
		type: Schema.Types.ObjectId,
		ref: "group"
	}
})

export const GroupSchema = new Schema({
	name: {
		type: String,
		required: false
	},
	depth: {
		type: Number,
		required: true
	},
	split: Boolean,
	column: Boolean,
	content: {
		type: [ContentSchema],
		required: true
	}
}, {
	timestamps: true
})

export default database.model("group", GroupSchema)