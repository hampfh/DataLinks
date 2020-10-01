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

		// Create group
		const newGroup = new GroupModel({
			split: req.body.split,
			column: req.body.column
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
		const group = await GroupModel.findOne({
			_id: id
		}) as Document & IGroup

		let deletions = []
		let deleteCount = 1

		for (let i = 0; i < group.content.length; i++) {
			if (group.content[i].group !== undefined) 
				deletions.push(this.recursiveDelete(group.content[i]._id))
		}

		deleteCount += deletions.length
		await Promise.all(deletions)

		await GroupModel.deleteOne({
			_id: id
		})
		return deleteCount
	}
}