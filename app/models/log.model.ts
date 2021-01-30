import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"
import { Severity, WhatIsIt } from "@typegoose/typegoose/lib/internal/constants"

export enum OperationType {
	CREATE = "CREATE",
	UPDATE = "UPDATE",
	DELETE = "DELETE"
}

export enum ContentType {
	GROUP = "GROUP",
	TEXT = "TEXT",
	LINK = "LINK",
	DEADLINE = "DEADLINE",
	SUBJECT = "SUBJECT"
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