import Joi from "joi"

export const createSubject = Joi.object({
	name: Joi.string().required(),
	code: Joi.string().required(),
	description: Joi.string().required(),
	color: Joi.string().required()
})

export const updateSubject = Joi.object({
	id: Joi.string().required(),
	name: Joi.string(),
	code: Joi.string(),
	description: Joi.string(),
	color: Joi.string()
}).or("name", "code", "description", "color")

export const createGroup = Joi.object({
	parentGroup: Joi.string(),
	name: Joi.string().optional(),
	split: Joi.bool(),
	column: Joi.bool(),
	placement: Joi.number().optional()
})

export const updateGroup = Joi.object({
	id: Joi.string().required(),
	name: Joi.string().optional(),
	split: Joi.bool(),
	column: Joi.bool(),
	placement: Joi.number()
})

export const findElementWithId = Joi.object({
	id: Joi.string()
})

export const findGroupChildElementId = Joi.object({
	parentGroupId: Joi.string().required(),
	id: Joi.string().required()
})

export const createLink = Joi.object({
	parentGroup: Joi.string(),
	displayText: Joi.string(),
	link: Joi.string(),
	placement: Joi.number().optional()
})

export const createText = Joi.object({
	parentGroup: Joi.string(),
	title: Joi.string().optional(),
	text: Joi.string(),
	placement: Joi.number().optional()
})

export const createDeadline = Joi.object({
	parentGroup: Joi.string(),
	displayText: Joi.string().optional(),
	deadline: Joi.date().required(),
	start: Joi.date().optional(),
	placement: Joi.number().optional()
})

export const updateLink = Joi.object({
	parentGroup: Joi.string().required(),
	id: Joi.string().required(),
	displayText: Joi.string().min(0),
	link: Joi.string().min(0)
}).or("displayText", "link")

export const updateText = Joi.object({
	parentGroup: Joi.string().required(),
	id: Joi.string().required(),
	title: Joi.string().optional(),
	text: Joi.string()
}).or("title", "text")

export const updateDeadline = Joi.object({
	parentGroup: Joi.string().required(),
	id: Joi.string().required(),
	displayText: Joi.string().min(0),
	deadline: Joi.date().min(5),
	start: Joi.date().min(5)
}).or("displayText", "deadline", "start")

export const nameContributor = Joi.object({
	name: Joi.string()
})