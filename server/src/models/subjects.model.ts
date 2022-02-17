import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose"
import { Schema } from "mongoose"
import { File } from "./file.model"
import { Group } from "./group.model"

class FileStructure {
	@prop({ required: true })
	folders!: FileStructure[]

	@prop({ required: true, ref: () => File, type: Schema.Types.ObjectId })
	files!: Ref<File>[]
}

@modelOptions({ schemaOptions: { timestamps: true }})
export class Subject {
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

	@prop({ required: true })
	public files!: FileStructure
}

export default getModelForClass(Subject)