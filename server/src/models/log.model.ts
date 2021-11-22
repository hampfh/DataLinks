import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose"
import { Schema } from "mongoose"
import { Content, Group } from "./group.model"
import { User } from "./user.model"

export enum OperationType {
	CREATE = "CREATE",
	UPDATE = "UPDATE",
	DELETE = "DELETE"
}

export enum ContentType {
	NONE = "NONE",
	GROUP = "GROUP",
	TEXT = "TEXT",
	LINK = "LINK",
	DEADLINE = "DEADLINE",
	SUBJECT = "SUBJECT",
	PROGRAM = "PROGRAM"
}

@modelOptions({ schemaOptions: { timestamps: true }})
class Log {
	@prop({ required: true, ref: () => User, type: Schema.Types.ObjectId })
	public user!: Ref<User>

	@prop({ required: true })
	public operation!: OperationType

	@prop({ required: true })
	public type!: ContentType

	@prop({ required: true, type: [String] })
	public from!: string[]

	@prop({ required: true, type: [String] })
	public to!: string[]
}

export default getModelForClass(Log)