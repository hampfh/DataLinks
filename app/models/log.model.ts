import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"

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
	@prop({ required: true })
	public user!: string

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