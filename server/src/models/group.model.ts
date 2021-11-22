import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose"
import { Schema } from "mongoose"

class Link {
	@prop({ required: true })
	public displayText!: string

	@prop({ required: true })
	public link!: string
}

class Text {
	@prop()
	public title?: string

	@prop({ required: true })
	public text!: string
}

class Deadline {
	@prop({ required: true })
	public displayText!: string

	@prop({ required: true })
	public deadline!: Date

	@prop({ required: true })
	public start!: Date
}

export class Content {
	@prop({ required: true, type: Schema.Types.ObjectId })
	public _id!: string

	@prop({ required: true })
	public placement!: number

	@prop()
	public link?: Link
	
	@prop()
	public text?: Text

	@prop()
	public deadline?: Deadline

	@prop({ ref: () => Group, type: Schema.Types.ObjectId })
	public group?: Ref<Group>
}

@modelOptions({ schemaOptions: { timestamps: true }})
export class Group {

	@prop()
	public name?: string

	@prop({ required: true })
	public depth!: number 

	@prop()
	public split?: boolean

	@prop()
	public column?: boolean

	@prop({ required: true, type: [Content] })
	public content!: Content[]
}

export default getModelForClass(Group)