import Joi from "joi"

export const createSubject = Joi.object({
	name: Joi.string().required(),
	code: Joi.string().required(),
	description: Joi.string().required(),
	color: Joi.string().required()
})

export const createGroup = Joi.object({
	parentGroup: Joi.string(),
	split: Joi.bool(),
	column: Joi.bool(),
	placement: Joi.number().optional()
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
	title: Joi.string(),
	text: Joi.string(),
	placement: Joi.number().optional()
})

export const updateText = Joi.object({
	parentGroup: Joi.string(),
	id: Joi.string(),
	title: Joi.string(),
	text: Joi.string()
})

export const updateLink = Joi.object({
	parentGroup: Joi.string(),
	id: Joi.string(),
	displayText: Joi.string(),
	link: Joi.string()
})