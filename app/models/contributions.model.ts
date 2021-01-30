import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"

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
class Contribution {
	@prop({ required: true })
	public operations!: Operation

	@prop({ required: true })
	public targets!: Target
}

@modelOptions({ schemaOptions: { timestamps: true }})
class Contributor {
	@prop()
	public name?: string

	@prop({ required: true })
	public contributions!: Contribution

	@prop({ required: true })
	public identifier!: string 
}

export default getModelForClass(Contributor)