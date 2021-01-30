import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose"
import { Schema } from "mongoose"
import { Group } from "./group.model"

@modelOptions({ schemaOptions: { timestamps: true }})
class Subject {
	@prop({ required: true })
	public name!: string

	@prop({ required: true })
	public code!: string

	@prop({ required: true })
	public description!: string

	@prop({ required: true })
	public logo!: string

	@prop({ required: true })
	public color!: string

	@prop({ required: true, ref: () => Group, type: Schema.Types.ObjectId })
	public group!: Ref<Group>

	@prop({ required: true })
	public archived!: boolean
}

export default getModelForClass(Subject)