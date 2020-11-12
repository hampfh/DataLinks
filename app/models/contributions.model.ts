import database from "./index.model"
const Schema = database.Schema

export interface IDB_Contributor {
	_id: string,
	name?: string,
	contributions: {
		operations: {
			creates: number,
			updates: number,
			deletes: number,
		}, 
		targets: {
			links: number,			// Amount of links either created, deleted or updated
			texts: number,			// Amount of texts either created, deleted or updated
			deadlines: number,		// Amount of deadlines either created, deleted or updated
			groups: number,			// Amount of groups either created, deleted or updated
			subjects: number		// Amount of subjects either created, deleted or updated
		}
	},
	identifier: string,
	createdAt?: string,
	updatedAt?: string,
	__v?: string
}

export const OperationSchema = new Schema({
	creates: {
		type: Number,
		required: true
	},
	updates: {
		type: Number,
		required: true
	},
	deletes: {
		type: Number,
		required: true
	},
}, {
	_id: false
})

export const TargetSchema = new Schema({
	links: {
		type: Number,
		required: true
	},
	texts: {
		type: Number,
		required: true
	},
	deadlines: {
		type: Number,
		required: true
	},
	groups: {
		type: Number,
		required: true
	},
	subjects: {
		type: Number,
		required: true
	}
}, {
	_id: false
})

export const ContributionSchema = new Schema({
	operations: {
		type: OperationSchema,
		required: true
	},
	targets: {
		type: TargetSchema,
		required: true
	}
}, {
	_id: false
})

export const ContributorSchema = new Schema({
	name: {
		type: String,
		required: false
	},
	contributions: {
		type: ContributionSchema,
		required: true,
	},
	identifier: {
		type: String,
		required: true
	}
}, {
	timestamps: true
})

export default database.model("contributor", ContributorSchema)