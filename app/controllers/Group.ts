import express from "express"
import { CrudController } from "./CrudController"
import { createGroup, findElementWithId } from "./schemas"
import GroupModel, { IGroup } from "../models/group.model"
import Mongoose, { Document } from "mongoose"

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
		const newGroup = new GroupModel({
			split: req.body.split,
			column: req.body.column,
			depth: parent.depth + 1
		})

		// Assign group to parent
		await GroupModel.updateOne({
			_id: req.body.parentGroup
		}, {
			$push: {
				content: {
					_id: new Mongoose.Types.ObjectId(),
					group: newGroup._id
				}
			}
		})

		await newGroup.save().catch(() => {
			res.status(500).json({
				message: "Internal error"
			})
		})
		if (!!!res.headersSent)
			res.status(201).json(newGroup)
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
	public async update(): Promise<void> {
		throw new Error("Not implemented")
	}
	public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = findElementWithId.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		const deletions = await GroupController.recursiveDelete(req.body.id)		

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
