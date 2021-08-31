import { mongoose } from "@typegoose/typegoose"
import express from "express"
import ContributorModel from "../models/contributions.model"
import ProgramModel from "../models/program.model"
import SubjectModel from "../models/subjects.model"
import { CrudController } from "./CrudController"
import { addContributorToProgram, addSubjectToProgram, createProgram, readProgram } from "./schemas"

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
		}

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
				programs: programs.reduce<Array<
				{ 
					id: string, 
					name: string, 
					subjects: unknown[], 
					contributors: unknown[] 
				}>>((prev, current) => {
					prev.push({
						id: current.id,
						name: current.name,
						subjects: current.subjects,
						contributors: current.contributors
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

		if (program != null && subjectExists) {

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

			res.status(201).json({
				message: "Successfully added subject to program"
			})
		} else {
			res.status(404).json({
				message: "Resource not found"
			})
		}
	}

	public async addContributor(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
		const { error } = addContributorToProgram.validate(req.body)
		if (error) {
			super.fail(res, error.message, 400, next)
			return 
		}

		const program = await ProgramModel.findOne({
			_id: req.body.id
		})

		const contributorExists = await ContributorModel.exists({
			_id: req.body.contributor
		})

		if (program != null && contributorExists) {

			if (program.contributors.find(current => current?.toString() === req.body.contributor)) {
				res.status(400).json({
					message: "This contributor is already a part of this program"
				})
				return
			}

			try {
				await ProgramModel.updateOne({
					_id: req.body.id
				}, {
					$push: {
						contributors: req.body.contributor
					}
				})
			} catch (error) {
				console.warn("Internal server error when adding subject to program", error)
				res.status(500).json({
					message: "Internal server error"
				})
				return
			}

			res.status(201).json({
				message: "Successfully added contributor to program"
			})
		} else {
			res.status(404).json({
				message: "Resource not found"
			})
		}
	}

	public async delete() {
		throw new Error("Not implemented")
	}
}