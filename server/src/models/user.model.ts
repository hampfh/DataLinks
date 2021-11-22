import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"
import { Contribution } from "./contributions.model"

export enum Privilege {
	DEFAULT = 0,
	MODERATOR = 1
}

export enum UserSettings {
	PUBLIC_PROFILE = 1
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