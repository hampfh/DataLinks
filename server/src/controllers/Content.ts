import express from "express"
import { CrudController } from "./CrudController"
import { createLink, createText, findGroupChildElementId, updateText, updateLink, createDeadline, updateDeadline, updateContentPosition } from "./schemas"
import GroupModel from "../models/group.model"
import Mongoose from "mongoose"
import Log from "./Log"
import { ContentType, OperationType } from "../models/log.model"
import Moment from "moment"
import RealTime from "../RealTime"
import { indexify, rebaseInArray } from "../utilities/placement"

export default class ContentController extends CrudController {

	public async createLink(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = createLink.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const appendObject = {
			_id: new Mongoose.Types.ObjectId().toHexString(),
			placement: req.body.placement ?? 0,
			link: {
				_id: new Mongoose.Types.ObjectId().toHexString(),
				displayText: req.body.displayText,
				link: req.body.link
			}
		}

		try {
			const result = await GroupModel.updateOne({
				_id: req.body.parentGroup
			}, {
				$push: {
					content: {
						$each: [appendObject],
						$position: req.body.placement
					}
				}
			})
			if (result.modifiedCount <= 0) {
				res.status(404).json({
					message: "Parent group doesn't exist"
				})
				return
			}
		} catch (error) {
			res.status(400).json({
				message: "The action could not be performed, probably because the positional argument exceeds the object count"
			})
			return
		}

		Log(
			req.body.fingerprint,
			OperationType.CREATE,
			ContentType.LINK,
			[req.body.displayText, req.body.link]
		)

		RealTime.emitToSockets("newElement", {
			parent: req.body.parentGroup,
			id: appendObject._id,
			nestedId: appendObject.link._id,
			placement: req.body.placement ?? 0,
			fieldOne: appendObject.link.displayText,
			fieldTwo: appendObject.link.link,
			type: ContentType.LINK
		})

		res.status(201).json({
			message: "Successfully created link object",
			element: appendObject
		})
		next()
	}

	public async createText(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = createText.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const appendObject = {
			_id: new Mongoose.Types.ObjectId().toHexString(),
			placement: req.body.placement ?? 0,
			text: {
				_id: new Mongoose.Types.ObjectId().toHexString(),
				title: req.body.title ?? "",
				text: req.body.text
			}
		}

		try {
			const result = await GroupModel.updateOne({
				_id: req.body.parentGroup
			}, {
				$push: {
					content: {
						$each: [appendObject],
						$position: req.body.placement
					}
				}
			})
			if (result.modifiedCount <= 0) {
				res.status(404).json({
					message: "Parent group doesn't exist"
				})
				return
			}
		} catch (error) {
			res.status(400).json({
				message: "The action could not be performed, probably because the positional argument exceeds the object count"
			})
			return
		}

		Log(
			req.body.fingerprint,
			OperationType.CREATE,
			ContentType.TEXT,
			[req.body.title ?? "", req.body.text]
		)

		RealTime.emitToSockets("newElement", {
			parent: req.body.parentGroup,
			id: appendObject._id,
			nestedId: appendObject.text._id,
			placement: req.body.placement ?? 0,
			fieldOne: appendObject.text.title,
			fieldTwo: appendObject.text.text,
			type: ContentType.TEXT
		})

		res.status(201).json({
			message: "Successfully created text object",
			element: appendObject
		})
		next()
	}

	public async createDeadline(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = createDeadline.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const appendObject = {
			_id: new Mongoose.Types.ObjectId().toHexString(),
			placement: req.body.placement ?? 0,
			deadline: {
				_id: new Mongoose.Types.ObjectId().toHexString(),
				displayText: req.body.displayText ?? "",
				deadline: req.body.deadline,
				start: req.body.start ?? Moment().toDate()
			}
		}

		try {
			const result = await GroupModel.updateOne({
				_id: req.body.parentGroup
			}, {
				$push: {
					content: {
						$each: [appendObject],
						$position: req.body.placement
					}
				}
			})
			if (result.modifiedCount <= 0) {
				res.status(404).json({
					message: "Parent group doesn't exist"
				})
				return
			}
		} catch (error) {
			res.status(400).json({
				message: "The action could not be performed, probably because the positional argument exceeds the object count"
			})
			return
		}

		Log(
			req.body.fingerprint,
			OperationType.CREATE,
			ContentType.DEADLINE,
			[req.body.displayText ?? "", req.body.deadline, req.body.start]
		)

		RealTime.emitToSockets("newElement", {
			parent: req.body.parentGroup,
			id: appendObject._id,
			nestedId: appendObject.deadline._id,
			placement: req.body.placement ?? 0,
			fieldOne: appendObject.deadline.displayText,
			fieldTwo: appendObject.deadline.deadline,
			fieldThree: appendObject.deadline.start,
			type: ContentType.DEADLINE
		})

		res.status(201).json({
			message: "Successfully created deadline object",
			element: appendObject
		})
		next()
	}

	public async create(): Promise<void> {
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
		})

		if (group == null) {
			res.status(404).json({
				message: "Could not find the requested group"
			})
			return
		}

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

		let group
		try {

			group = await GroupModel.findOne({
				_id: req.body.parentGroup,
				"content._id": req.body.id
			}, {
				"content.$": 1
			})

			// User tries to update item that has been deleted or doesn't exist
			if (group == null) {
				res.status(404).json({
					message: "Specified group doesn't exist"
				})
				return
			}

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
		} catch (error) {
			console.warn(error)
			res.json({
				message: "Internal error"
			})
			return
		}

		// Notify logg			
		Log(
			req.body.fingerprint,
			OperationType.UPDATE,
			ContentType.LINK,
			[req.body.displayText, req.body.link],
			[group.content[0].link?.displayText as string, group.content[0].link?.link as string]
		)

		RealTime.emitToSockets("updateElement", {
			parent: req.body.parentGroup,
			id: req.body.id,
			fieldOne: req.body.displayText ?? group.content[0].link?.displayText,
			fieldTwo: req.body.link ?? group.content[0].link?.link,
			type: ContentType.LINK
		})

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
		
		let group
		try {
			group = await GroupModel.findOne({
				_id: req.body.parentGroup,
				"content._id": req.body.id
			}, {
				"content.$": 1
			})

			// User tries to update item that has been deleted or doesn't exist
			if (group == null) {
				res.status(404).json({
					message: "Specified group doesn't exist"
				})
				return
			}
			
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
		} catch (error) {
			console.warn(error)
			res.json({
				message: "Internal error"
			})
			return
		}

		// Notify logg			
		Log(
			req.body.fingerprint,
			OperationType.UPDATE,
			ContentType.TEXT,
			[req.body.title, req.body.text],
			[group.content[0].text?.title as string, group.content[0].text?.text as string]
		)

		RealTime.emitToSockets("updateElement", {
			parent: req.body.parentGroup,
			id: req.body.id,
			fieldOne: req.body.title ?? group.content[0].text?.title,
			fieldTwo: req.body.text ?? group.content[0].text?.text,
			type: ContentType.TEXT
		})

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

		let group
		try {
			group = await GroupModel.findOne({
				_id: req.body.parentGroup,
				"content._id": req.body.id
			}, {
				"content.$": 1
			})

			// User tries to update item that has been deleted or doesn't exist
			if (group == null) {
				res.status(404).json({
					message: "Specified group doesn't exist"
				})
				return
			}

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
				req.body.fingerprint,
				OperationType.UPDATE,
				ContentType.TEXT,
				[req.body.displayText, req.body.deadline],
				[group.content[0].deadline?.displayText as string, (group.content[0].deadline?.deadline as Date).toString()]
			)
		} catch (error) {
			console.warn(error)
			res.json({
				message: "Internal error"
			})
			return
		}

		RealTime.emitToSockets("updateElement", {
			parent: req.body.parentGroup,
			id: req.body.id,
			fieldOne: req.body.displayText ?? group.content[0].deadline?.displayText,
			fieldTwo: req.body.deadline ?? group.content[0].deadline?.deadline,
			fieldThree: req.body.start ?? group.content[0].deadline?.start,
			type: ContentType.DEADLINE
		})

		res.json({
			message: "Successfully updated field",
			deadline: {
				displayText: req.body.displayText,
				deadline: req.body.deadline,
				start: req.body.start
			}
		})
	}

	public async updateContentPosition(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = updateContentPosition.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		// Find group and sort it by placement
		const group = await GroupModel.findOne({
			_id: req.body.parentGroup,
		})

		if (group == null) {
			res.json(404).json({
				message: "Requested group doesn't exist"
			})
			return
		}

		// Sort group content (ASC)
		group.content.sort((a, b) => a.placement - b.placement)

		try {
			rebaseInArray(group.content, req.body.id, req.body.position)
		} catch(error) {
			res.status(404).json({
				message: "The specified element doesn't exist within the group"
			})
			return
		}

		// Re-create placements from array position
		indexify(group.content)

		try {
			group.save()	
		} catch (error) {
			console.warn("Rebasing content:", error)
			res.status(500).json({
				message: "Internal error"
			})
			return
		}

		// Find content in group
		const content = group.content.find((current) => current._id.toString() === req.body.id)

		// Notify logg			
		Log(
			req.body.fingerprint,
			OperationType.UPDATE,
			content?.text ? ContentType.TEXT : 
				content?.link ? ContentType.LINK :
					content?.deadline ? ContentType.DEADLINE :
						content?.group ? ContentType.GROUP : ContentType.NONE,		
			["New position", `${req.body.position}`],
			["", ""]
		)

		RealTime.emitToSockets("updatePosition", {
			parent: req.body.parentGroupId,
			id: req.body.id,
			position: req.body.position
		})

		res.json({
			message: "Successfully reordered content"
		})
	}

	public async update(): Promise<void> {
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
		})

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
			req.body.fingerprint,
			OperationType.DELETE,
			type,
			["", ""],
			[fieldOne, fieldTwo]
		)

		RealTime.emitToSockets("deleteElement", {
			parent: req.body.parentGroupId,
			id: req.body.id
		})

		res.status(200).json({
			message: "Successfully deleted item"
		})
		next()
	}
}