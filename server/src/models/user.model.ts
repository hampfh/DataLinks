import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"

export enum Privilege {
	DEFAULT = 0,
	MODERATOR = 1
}

export enum UserSettings {
	PUBLIC_PROFILE = 1
}

@modelOptions({ schemaOptions: { _id: false }})
class Operation {
	@prop({ required: true })
	public creates!: number

	@prop({ required: true })
	public updates!: number

	@prop({ required: true })
	public deletes!: number
}

@modelOptions({ schemaOptions: { _id: false }})
class Target {
	@prop({ required: true })
	public links!: number 				// Amount of links either created, deleted or updated

	@prop({ required: true })
	public texts!: number				// Amount of texts either created, deleted or updated

	@prop({ required: true })			
	public deadlines!: number			// Amount of deadlines either created, deleted or updated

	@prop({ required: true })
	public groups!: number				// Amount of groups either created, deleted or updated

	@prop({ required: true })
	public subjects!: number			// Amount of subjects either created, deleted or updated
}

@modelOptions({ schemaOptions: { _id: false }})
export class Contribution {
	@prop({ required: true })
	public operations!: Operation

	@prop({ required: true })
	public targets!: Target
}
@modelOptions({ schemaOptions: { timestamps: true }})
export class User {
	@prop({ required: true })
	public kthId!: string

	@prop({ required: true })
	public loginCount!: number

	@prop({ required: true })
	public lastLogin!: Date

	@prop({ required: true })
	public privilege!: Privilege

	@prop({ required: true })
	public settings!: number // Bitwise number combining UserSettings

	@prop({ required: false, type: Contribution })
	public contributions!: Contribution
}

export default getModelForClass(User)