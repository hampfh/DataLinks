import database from "./index.model"
const Schema = database.Schema

export enum OperationType {
	"CREATE" = "CREATE",
	"UPDATE" = "UPDATE",
	"DELETE" = "DELETE"
}

export enum ContentType {
	"GROUP" = "GROUP",
	"TEXT" = "TEXT",
	"LINK" = "LINK",
	"DEADLINE" = "DEADLINE",
	"SUBJECT" = "SUBJECT"
}

export const LogSchema = new Schema({
	user: {
		type: String,
		required: true
	},
	operation: {
		type: OperationType,
		required: true
	},
	type: {
		type: ContentType,
		required: true
	},
	from: {
		type: [String],
		required: false
	},
	to: {
		type: [String],
		required: false,
	}
}, {
	timestamps: true
})

export default database.model("log", LogSchema)