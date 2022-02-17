import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose"
import { User } from "./user.model"

@modelOptions({ schemaOptions: { timestamps: true }})
export class File {
	@prop({ required: true })
	public title!: string

	@prop({ required: true })
	public author!: Ref<User>

	@prop({ required: false })
	public downloads!: number

	@prop({ required: true })
	public file!: {
		data: Buffer
		contentType: string
	}
}

export default getModelForClass(File)