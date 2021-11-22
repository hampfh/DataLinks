import { mongoose } from "@typegoose/typegoose"
import express from "express"
import { ContentType, OperationType } from "../models/log.model"
import ProgramModel from "../models/program.model"
import SubjectModel from "../models/subjects.model"
import { CrudController } from "./CrudController"
import Log from "./Log"
import { addSubjectToProgram, createProgram, readProgram } from "./schemas"

export default class ProgramController extends CrudController {
	public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = createProgram.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return 
		}

		const newProgram = new ProgramModel({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name
		})

		try {
			await newProgram.save()
		} catch (error) {
			res.status(500).json({
				message: "Internal server error"
			})
			return
		}

		await Log(
			req.user!.id,
			OperationType.CREATE,
			ContentType.PROGRAM,
			[
				newProgram._id, 
				req.body.name
			]
		)

		res.status(201).json({
			message: "Successfully created program",
			program: {
				id: newProgram._id.toString(),
				name: newProgram.name
			}
		})
	}

	public async read(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = readProgram.validate(req.query)
		if (error) {
			super.fail(res, error.message, 400, next)
			return 
		}

		const queryObject: {
			_id?: string,
			name?: string
		} = {}

		if (req.query.id != null)
			queryObject._id = req.query.id?.toString()
		if (req.query.name != null)
			queryObject.name = req.query.name?.toString()

		try {
			const programs = await ProgramModel.find(queryObject)
			res.status(200).json({
				message: "Successfully fetched programs",
				programs: programs.reduce<Array<{ 
					id: string, 
					name: string, 
					subjects: unknown[], 
				}>>((prev, current) => {
					prev.push({
						id: current.id,
						name: current.name,
						subjects: current.subjects
					})
					return prev
				}, [])
			})
		} catch (error) {
			res.status(500).json({
				message: "Internal server error"
			})
		}
	}

	public async update() {
		throw new Error("Not implemented")
	}

	public async addSubject(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = addSubjectToProgram.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return 
		}

		const program = await ProgramModel.findOne({
			_id: req.body.id
		})

		const subjectExists = await SubjectModel.exists({
			_id: req.body.subject
		})

		if (program == null || !subjectExists) {

			res.status(404).json({
				message: "Resource not found"
			})
			return
		}

		if (program.subjects.find(current => current?.toString() === req.body.subject) != null) {
			res.status(400).json({
				message: "This subject is already a part of this program"
			})
			return
		}

		try {
			await ProgramModel.updateOne({
				_id: req.body.id
			}, {
				$push: {
					subjects: req.body.subject
				}
			})
		} catch (error) {
			console.warn("Internal server error when adding subject to program", error)
			res.status(500).json({
				message: "Internal server error"
			})
			return
		}

		await Log(
			req.user!.id,
			OperationType.UPDATE,
			ContentType.PROGRAM,
			[
				"New Subject",
				req.body.id, 
				req.body.subject
			]
		)

		res.status(201).json({
			message: "Successfully added subject to program"
		})
	}

	public async delete() {
		throw new Error("Not implemented")
	}
}