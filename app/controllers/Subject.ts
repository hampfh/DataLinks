import express from "express"
import { CrudController } from "./CrudController"
import { createSubject } from "./schemas"
import SubjectModel from "../models/subjects.model"

export default class GuestController extends CrudController {
	public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = createSubject.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return 
		}

		// TODO make sure there isn't one already

		const newSubject = new SubjectModel({
			name: req.body.name,
			code: req.body.code,
			description: req.body.description,
			color: req.body.color
		})
		await newSubject.save().catch(() => {
			res.status(500).json({
				message: "Internal error"
			})
		})
		if (!!!res.headersSent)
			res.status(201).json(newSubject)
	}
	public async read(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

		const response = await SubjectModel.find()
		
		if (response == null)
			res.status(200).json([])
		else
			res.status(200).json(response)
		next()
	}
	public async update(): Promise<void> {
		throw new Error("Not implemented")
	}
	public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		throw new Error("Not implemented")
	}
}