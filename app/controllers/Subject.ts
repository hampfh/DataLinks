import express from "express"
import { CrudController } from "./CrudController"
import { createSubject, findElementWithId } from "./schemas"
import SubjectModel, { ISubject } from "../models/subjects.model"
import GroupModel from "../models/group.model"
import { Subject } from "."
import { Document } from "mongoose"
import GroupController from "./Group"
import Log from "../controllers/Log"
import { ContentType, OperationType } from "../models/log.model"

export default class SubjectController extends CrudController {
	public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = createSubject.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return 
		}

		// TODO make sure there isn't one already

		// Create root content group
		const newGroup = new GroupModel({
			split: req.body.split,
			column: req.body.column,
			depth: 1
		})
		await newGroup.save()

		const newSubject = new SubjectModel({
			name: req.body.name,
			code: req.body.code,
			description: req.body.description,
			color: req.body.color,
			group: newGroup._id
		}) as Document & {
			name: string,
			code: string,
			description: string,
			color: string,
			group: string
		}
		await newSubject.save().catch(() => {
			res.status(500).json({
				message: "Internal error"
			})
		})

		// Notify logg			
		Log(
			req.ip,
			OperationType.CREATE,
			ContentType.SUBJECT,
			["", "", ""],
			[newSubject._id, newSubject.name, newSubject.description]
		);
		
		if (!!!res.headersSent)
			res.status(201).json(newSubject)
		next()
	}
	public async read(req: express.Request, res: express.Response): Promise<void> {

		// Max depth is 5
		const response = await SubjectModel.find().populate("group").populate({
			path: "group",
			populate: {
				path: "content.group",
				populate: {
					path: "content.group",
					populate: {
						path: "content.group",
						populate: {
							path: "content.group",
							populate: {
								path: "content.group",
							}
						}
					}
				}
			}
		})
		
		if (response == null)
			res.status(200).json([])
		else
			res.status(200).json({
				result: response
			})
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

		const subject = await SubjectModel.findOne({
			_id: req.body.id
		}) as Document & ISubject

		await GroupController.recursiveDelete(subject.group._id.toString())

		await SubjectModel.deleteOne({
			_id: req.body.id
		})

		// Notify logg			
		Log(
			req.ip,
			OperationType.DELETE,
			ContentType.SUBJECT,
			["", "", ""],
			[subject._id, subject.name, subject.description]
		);

		res.json({
			message: "Successfully deleted subject"
		})
	}
}