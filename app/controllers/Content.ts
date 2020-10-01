import express from "express"
import { CrudController } from "./CrudController"
import { createGroup, createLink, createText, findElementWithId, findGroupChildElementId } from "./schemas"
import GroupModel, { IContent, IGroup } from "../models/group.model"
import Mongoose from "mongoose"

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
			link: {
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

		res.status(201).json({
			message: "Successfully created link object",
			appendObject
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
			text: {
				title: req.body.title,
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

		res.status(201).json({
			message: "Successfully created text object",
			appendObject
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
	public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		throw new Error("Not implemented")
	}
	public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = findGroupChildElementId.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		try {
			await GroupModel.updateOne({
				_id: req.body.parentGroupId
			}, {
				$pull: {
					_id: req.body.id
				}
			}) as Mongoose.Document & IGroup
		} catch (error) {
			res.status(500).json({
				message: "Could not delete specified item"
			})
			return
		}

		res.status(200).json({
			message: "Successfully deleted item"
		})
		next()
	}
}