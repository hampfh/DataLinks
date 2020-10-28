import express from "express"
import { CrudController } from "./CrudController"
import { createLink, createText, findGroupChildElementId, updateText, updateLink, createDeadline, updateDeadline } from "./schemas"
import GroupModel, { IContent, IGroup } from "../models/group.model"
import Mongoose from "mongoose"
import Log from "./Log"
import { ContentType, OperationType } from "../models/log.model"
import GroupController from "./Group"
import Moment from "moment"

interface AppendObject {
	_id: Mongoose.Types.ObjectId,
	displayText?: string,
	link?: string,
	title?: string,
	text?: string,
	split?: string,
	column?: string
}

export default class ContentController extends CrudController {

	public async createLink(req: express.Request, res: express.Response, next: express.NextFunction) {
		const { error } = createLink.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const appendObject = {
			_id: new Mongoose.Types.ObjectId(),
			placement: req.body.placement ?? 0,
			link: {
				_id: new Mongoose.Types.ObjectId(),
				displayText: req.body.displayText,
				link: req.body.link
			}
		}

		await GroupModel.updateOne({
			_id: req.body.parentGroup
		}, {
			$push: {
				content: appendObject
			}
		})

		Log(
			req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string,
			OperationType.CREATE,
			ContentType.LINK,
			[req.body.displayText, req.body.link]
		)

		res.status(201).json({
			message: "Successfully created link object",
			element: appendObject
		})
		next()
	}

	public async createText(req: express.Request, res: express.Response, next: express.NextFunction) {
		const { error } = createText.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const appendObject = {
			_id: new Mongoose.Types.ObjectId(),
			placement: req.body.placement ?? 0,
			text: {
				_id: new Mongoose.Types.ObjectId(),
				title: req.body.title ?? "",
				text: req.body.text
			}
		}

		await GroupModel.updateOne({
			_id: req.body.parentGroup
		}, {
			$push: {
				content: appendObject
			}
		})

		Log(
			req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string,
			OperationType.CREATE,
			ContentType.TEXT,
			[req.body.title ?? "", req.body.text]
		)

		res.status(201).json({
			message: "Successfully created text object",
			element: appendObject
		})
		next()
	}

	public async createDeadline(req: express.Request, res: express.Response, next: express.NextFunction) {
		const { error } = createDeadline.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const appendObject = {
			_id: new Mongoose.Types.ObjectId(),
			placement: req.body.placement ?? 0,
			deadline: {
				_id: new Mongoose.Types.ObjectId(),
				displayText: req.body.displayText ?? "",
				deadline: req.body.deadline,
				start: req.body.start ?? Moment().toDate()
			}
		}

		await GroupModel.updateOne({
			_id: req.body.parentGroup
		}, {
			$push: {
				content: appendObject
			}
		})

		Log(
			req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string,
			OperationType.CREATE,
			ContentType.DEADLINE,
			[req.body.displayText ?? "", req.body.deadline, req.body.start]
		)

		res.status(201).json({
			message: "Successfully created deadline object",
			element: appendObject
		})
		next()
	}

	public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		throw new Error("Method not implemented")
	}
	public async read(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = findGroupChildElementId.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const group = await GroupModel.findOne({
			_id: req.body.parentGroupId
		}) as Mongoose.Document & IGroup

		const target = group.content.find((content) => {
			return content._id.toString() === req.body.id.toString()
		})

		if (target != null)
			res.status(404).json({})
		else
			res.status(200).json(target)
		next()
	}

	public async updateLink(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = updateLink.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		if (req.body.displayText === "-")
			req.body.displayText = ""
		if (req.body.link === "-")
			req.body.link = ""

		try {

			const group = await GroupModel.findOne({
				_id: req.body.parentGroup,
				"content._id": req.body.id
			}, {
				"content.$.link": 1
			}) as Mongoose.Document & IGroup

			if (group == null)
				throw new Error()

			await GroupModel.updateOne({
				_id: req.body.parentGroup,
				"content._id": req.body.id
			}, {
				$set: {
					"content.$.link": {
						displayText: req.body.displayText ?? group.content[0].link?.displayText,
						link: req.body.link ?? group.content[0].link?.link
					}
				}
			})

			// Notify logg			
			Log(
				req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string,
				OperationType.UPDATE,
				ContentType.LINK,
				[req.body.displayText, req.body.link],
				[group.content[0].link?.displayText as string, group.content[0].link?.link as string]
			);
		} catch (error) {
			console.warn(error)
			res.json({
				message: "Internal error"
			})
			return
		}

		res.json({
			message: "Successfully updated field",
			link: {
				displayText: req.body.displayText,
				link: req.body.link
			}
		})
	}

	public async updateText(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = updateText.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		if (req.body.title === "-" || req.body.title === undefined)
			req.body.title = ""
		if (req.body.text === "-")
			req.body.text = ""
		
		try {
			const group = await GroupModel.findOne({
				_id: req.body.parentGroup,
				"content._id": req.body.id
			}, {
				"content.$.text": 1
			}) as Mongoose.Document & IGroup

			if (group == null)
				throw new Error()
			
			await GroupModel.updateOne({
				_id: req.body.parentGroup,
				"content._id": req.body.id
			}, {
				$set: {
					"content.$.text": {
						title: req.body.title ?? group.content[0].text?.title,
						text: req.body.text ?? group.content[0].text?.text,
					}
				}
			})

			// Notify logg			
			Log(
				req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string, 
				OperationType.UPDATE, 
				ContentType.TEXT,
				[req.body.title, req.body.text], 
				[group.content[0].text?.title as string, group.content[0].text?.text as string]
			);
		} catch (error) {
			console.warn(error)
			res.json({
				message: "Internal error"
			})
			return
		}

		res.json({
			message: "Successfully updated field",
			text: {
				title: req.body.title,
				text: req.body.text
			}
		})
	}

	public async updateDeadline(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = updateDeadline.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		if (req.body.displayText === "-" || req.body.displayText === undefined)
			req.body.displayText = ""

		try {
			const group = await GroupModel.findOne({
				_id: req.body.parentGroup,
				"content._id": req.body.id
			}, {
				"content.$.deadline": 1
			}) as Mongoose.Document & IGroup

			if (group == null)
				throw new Error()

			await GroupModel.updateOne({
				_id: req.body.parentGroup,
				"content._id": req.body.id
			}, {
				$set: {
					"content.$.deadline": {
						displayText: req.body.displayText ?? group.content[0].deadline?.displayText,
						deadline: req.body.deadline ?? group.content[0].deadline?.deadline,
						start: req.body.start ?? group.content[0].deadline?.start
					}
				}
			})

			// Notify logg			
			Log(
				req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string,
				OperationType.UPDATE,
				ContentType.TEXT,
				[req.body.displayText, req.body.deadline],
				[group.content[0].deadline?.displayText as string, (group.content[0].deadline?.deadline as Date).toString()]
			);
		} catch (error) {
			console.warn(error)
			res.json({
				message: "Internal error"
			})
			return
		}

		res.json({
			message: "Successfully updated field",
			deadline: {
				displayText: req.body.displayText,
				deadline: req.body.deadline,
				start: req.body.start
			}
		})
	}

	public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		throw new Error("Not implemented")
	}
	public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = findGroupChildElementId.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const group = await GroupModel.findOne({
			_id: req.body.parentGroupId,
			"content._id": req.body.id
		}) as Mongoose.Document & IGroup

		if (group == null) {
			res.status(404).json({
				message: "Id did not match any specific object"
			})
			return
		}

		try {
			await GroupModel.updateOne({
				_id: req.body.parentGroupId
			}, {
				$pull: {
					content: {
						_id: req.body.id
					}
				}
			}).exec()
		} catch (error) {
			res.status(500).json({
				message: "Could not delete specified item"
			})
			return
		}

		let fieldOne = ""
		let fieldTwo = ""
		let type = ContentType.GROUP
		if (group.content[0].link !== undefined) {
			type = ContentType.LINK
			fieldOne = group.content[0].link.displayText
			fieldTwo = group.content[0].link.link
		}
		else if (group.content[0].text !== undefined) {
			type = ContentType.TEXT
			fieldOne = group.content[0].text.title as string
			fieldTwo = group.content[0].text.text as string
		}
		else if (group.content[0].group !== undefined) {
			type = ContentType.GROUP
		}

		// Notify logg			
		Log(
			req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string,
			OperationType.DELETE,
			type,
			["", ""],
			[fieldOne, fieldTwo]
		);

		res.status(200).json({
			message: "Successfully deleted item"
		})
		next()
	}
}