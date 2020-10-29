import express from "express"
import { CrudController } from "./CrudController"
import { createGroup, findElementWithId, updateGroup } from "./schemas"
import GroupModel, { IGroup } from "../models/group.model"
import Mongoose, { Document } from "mongoose"
import Log from "../controllers/Log"
import { ContentType, OperationType } from "../models/log.model"

export default class GroupController extends CrudController {
	public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = createGroup.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const parent = await GroupModel.findOne({
			_id: req.body.parentGroup
		}) as Document & IGroup
		if (parent == null) {
			res.status(500).json({
				message: "Internal error"
			})
			return
		}

		// Create group
		let object: {
			name?: string,
			split: boolean,
			column: boolean,
			depth: number
		} = {
			split: req.body.split,
			column: req.body.column,
			depth: parent.depth + 1
		}

		if (req.body.name != null)
			object.name = req.body.name

		const newGroup = new GroupModel(object) as Mongoose.Document & IGroup

		// Assign group to parent
		await GroupModel.updateOne({
			_id: req.body.parentGroup
		}, {
			$push: {
				content: {
					_id: new Mongoose.Types.ObjectId(),
					placement: req.body.placement ?? 0,
					group: newGroup._id
				}
			}
		})

		await newGroup.save().catch(() => {
			res.status(500).json({
				message: "Internal error"
			})
		})

		// Notify logg			
		Log(
			req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string,
			OperationType.CREATE,
			ContentType.GROUP,
			[""],
			["GROUP: " + newGroup.name]
		);

		if (!!!res.headersSent)
			res.status(201).json({
				group: newGroup
			})
		next()
	}
	public async read(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

		const { error } = findElementWithId.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const response = await GroupModel.find({
			_id: req.body.findElementWithId
		}).populate("group")

		if (response != null)
			res.status(404).json({})
		else
			res.status(200).json(response)
		next()
	}
	public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = updateGroup.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		let updateObject: {
			name?: string,
			column?: boolean,
			split?: boolean,
			placement?: number
		} = {}

		if (req.body.name != null)
			updateObject.name = req.body.name
		if (req.body.column != null)
			updateObject.column = req.body.column
		if (req.body.split != null)
			updateObject.split = req.body.split
		if (req.body.placement != null)
			updateObject.placement = req.body.placement
		

		try {
			await GroupModel.updateOne({
				_id: req.body.id
			}, updateObject)
		} catch (error) {
			res.status(500).json({
				message: "Could not perform request, internal error"
			})
			return
		}

		// Notify logg			
		Log(
			req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string,
			OperationType.UPDATE,
			ContentType.GROUP,
			[""],
			["GROUP: " + req.body.id]
		);

		res.status(200).json({
			message: "Resource updated",
			group: {
				_id: req.body.id,
				name: req.body.name ?? undefined,
				split: req.body.split,
				column: req.body.column,
				placement: req.body.placement,
			}
		})
	}
	public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = findElementWithId.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const deletions = await GroupController.recursiveDelete(req.body.id)		

		// Notify logg			
		Log(
			req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string,
			OperationType.DELETE,
			ContentType.GROUP,
			[""],
			["GROUP: " + req.body.id]
		);

		res.status(200).json({
			message: `Successfully deleted ${deletions} groups`
		})
		next()
	}

	// Recursivly deletes all groups
	public static async recursiveDelete(id: string): Promise<number> {
		if (id.length <= 0)
			return 0

		const group = await GroupModel.findOne({
			_id: id
		}) as Document & IGroup

		if (group == null)
			return 0

		let deletions = []
		let deleteCount = 1

		if (group.content != null) {
			for (let i = 0; i < group.content.length; i++) {
				deletions.push(this.recursiveDelete(group.content[i].group?._id ?? ""))
			}
		}

		deleteCount += deletions.length
		await Promise.all(deletions)

		await GroupModel.deleteOne({
			_id: id
		})
		return deleteCount
	}
}
