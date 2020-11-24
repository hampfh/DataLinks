import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import ContributorModel, { IDB_Contributor } from "../models/contributions.model";
import { ContentType, OperationType } from "../models/log.model";
import { nameContributor } from "./schemas";
import RealTime from "../RealTime";

export default class Contributors {

	async nameContributor(req: Request, res: Response) {
		const { error } = nameContributor.validate(req.body)
		if (error) {
			res.status(400).json({
				message: error.message
			})
			return
		}

		const response = await ContributorModel.findOne({
			identifier: req.body.fingerprint
		}) as Document & IDB_Contributor

		// Contributor doesn't exist, create new one
		if (response == null) {
			await Contributors.createNewContributor(req.body.fingerprint, req.body.name)
			res.json({
				message: `New contributor added with name ${req.body.name}`
			})
			return
		}

		// Update already existing contributor
		response.name = req.body.name
		response.save()

		res.json({
			message: `Successfully changed contributor name to ${req.body.name}`
		})
	}

	async getContributors(req: Request, res: Response) {
		const contributors = await ContributorModel.aggregate([
			{
				'$project': {
					'name': 1,
					'contributions': 1,
					'updatedAt': 1,
					'identifier': 1
				}
			}, {
				'$addFields': {
					'contributionCount': {
						'$sum': [
							'$contributions.operations.creates', '$contributions.operations.updates', '$contributions.operations.deletes'
						]
					}
				}
			}, {
				'$project': {
					'_id': 0,
					'name': 1,
					'contributions': {
						'operations': 1
					},
					'contributionCount': 1,
					'updatedAt': 1,
					'identifier': 1
				}
			},{
				'$sort': {
					'contributionCount': -1
				}
			}, {
				'$limit': 1000
			}
		])

		res.json({
			contributors
		})
	}
	
	async contribute(fingerprint: string, operation: OperationType, type: ContentType) {
		// Check if user exists
		const response = await ContributorModel.findOne({
			identifier: fingerprint
		}) as Document & IDB_Contributor

		// This machine doesn't exist, create new
		if (response == null) {
			await Contributors.createNewContributor(fingerprint, null, operation, type)
			return
		}

		switch (operation) {
			case "CREATE":
				response.contributions.operations.creates++
				break
			case "UPDATE":
				response.contributions.operations.updates++
				break
			case "DELETE":
				response.contributions.operations.deletes++
				break
		}

		switch (type) {
			case "GROUP":
				response.contributions.targets.groups++
				break
			case "TEXT":
				response.contributions.targets.texts++
				break
			case "LINK":
				response.contributions.targets.links++
				break
			case "DEADLINE":
				response.contributions.targets.deadlines++
				break
			case "SUBJECT":
				response.contributions.targets.subjects++
				break
		}

		// Update contributor
		response.save()

		// TODO only emit to users on the /contributors page
		RealTime.emitToSockets("contribution", { 
			name: response.name ?? "Anonymous",
			identifier: fingerprint, 
			operation,
			type
		})
	}

	private static async createNewContributor(fingerprint: string, name: string | null, operation?: OperationType, type?: ContentType) {
		const newContributor = new ContributorModel({
			name,
			contributions: {
				operations: {
					creates: operation === "CREATE" ? 1 : 0,
					updates: operation === "UPDATE" ? 1 : 0,
					deletes: operation === "DELETE" ? 1 : 0,
				},
				targets: {
					links: type === "LINK" ? 1 : 0,
					texts: type === "TEXT" ? 1 : 0,
					deadlines: type === "DEADLINE" ? 1 : 0,
					groups: type === "GROUP" ? 1 : 0,
					subjects: type === "SUBJECT" ? 1 : 0
				}
			},
			identifiers: [fingerprint]
		} as IDB_Contributor)

		// Save contributor
		await newContributor.save()
	}
}