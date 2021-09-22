import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose"
import { Schema } from "mongoose"
import { Contributor } from "./contributions.model"
import { Subject } from "./subjects.model"

@modelOptions({ schemaOptions: { timestamps: true }})
export class Program {
	@prop({ required: true })
	public name!: string

	@prop({ required: true, ref: () => Subject, type: [Schema.Types.ObjectId] })
	public subjects!: Ref<Subject>[]

	@prop({ required: true, ref: () => Contributor, type: [Schema.Types.ObjectId] })
	public contributors!: Ref<Contributor>[]
}

export default getModelForClass(Program)