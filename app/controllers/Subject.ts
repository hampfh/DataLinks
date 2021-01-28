import express from "express"
import { CrudController } from "./CrudController"
import { createSubject, findElementWithIdFingerPrint, updateSubject } from "./schemas"
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
			logo: req.body.logo,
			color: req.body.color,
			group: newGroup._id
		}) as Document & {
			name: string,
			code: string,
			description: string,
			logo: string,
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
			req.body.fingerprint,
			OperationType.CREATE,
			ContentType.SUBJECT,
			[newSubject._id, newSubject.name, newSubject.description],
			["", "", ""]
		);
		
		if (!!!res.headersSent)
			res.status(201).json(newSubject)
		next()
	}
	public async read(req: express.Request, res: express.Response): Promise<void> {

		// Max depth is 5
		const response = await SubjectModel.find({
			archived: false
		}).populate("group").populate({
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
	public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = updateSubject.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return
		}

		let appendObject: {
			name?: string,
			code?: string,
			description?: string,
			logo?: string
			color?: string
		} = {}

		if (req.body.name != null)
			appendObject.name = req.body.name
		if (req.body.code != null)
			appendObject.code = req.body.code
		if (req.body.description != null)
			appendObject.description = req.body.description
		if (req.body.logo != null)
			appendObject.logo = req.body.logo
		if (req.body.color != null)
			appendObject.color = req.body.color

		try {
			await SubjectModel.updateOne({
				_id: req.body.id
			}, appendObject) as Document

			res.status(200).json({
				message: "Successfully updated subject"
			})
		} catch (error) {
			res.status(500).json({
				message: "Encountered internal server error"
			})
		}
	}
	public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = findElementWithIdFingerPrint.validate(req.body)
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
			req.body.fingerprint,
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