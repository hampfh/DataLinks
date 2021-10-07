import { Request, Response } from "express"
import ContributorModel from "../models/contributions.model"
import { ContentType, OperationType } from "../models/log.model"
import { getContributors, mergeContributors, nameContributor } from "./schemas"
import RealTime from "../RealTime"
import ProgramModel from "../models/program.model"

export default class Contributors {

	async nameContributor(req: Request, res: Response): Promise<void> {
		const { error } = nameContributor.validate(req.body)
		if (error) {
			res.status(400).json({
				message: error.message
			})
			return
		}

		const response = await ContributorModel.findOne({
			identifier: req.body.fingerprint
		})

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

	/**
	 * Merge two different fingerprints into one contributor (all stats are added together)
	 * @param req 
	 * @param res 
	 */
	async mergeContributors(req: Request, res: Response): Promise<void> {
		const { error } = mergeContributors.validate(req.body)
		if (error) {
			res.status(400).json({
				message: error.message
			})
			return
		}

		const main = await ContributorModel.findOne({
			identifier: req.body.fingerprint
		})

		const mergeTarget = await ContributorModel.findOne({
			identifier: req.body.otherFingerprint
		})

		if (!main || !mergeTarget) {
			res.status(404).json({
				message: "The specified fingerprint doesn't match a contributor"
			})
			return
		}

		// Add merge target's stats
		main.identifier.push(req.body.otherFingerprint)
		main.contributions.operations.creates += mergeTarget.contributions.operations.creates
		main.contributions.operations.updates += mergeTarget.contributions.operations.updates
		main.contributions.operations.deletes += mergeTarget.contributions.operations.deletes

		main.contributions.targets.texts += mergeTarget.contributions.targets.texts
		main.contributions.targets.links += mergeTarget.contributions.targets.links
		main.contributions.targets.deadlines += mergeTarget.contributions.targets.deadlines
		main.contributions.targets.groups += mergeTarget.contributions.targets.groups
		main.contributions.targets.subjects += mergeTarget.contributions.targets.subjects

		// Resave the main contributor
		main.save()

		// Delete old merge target
		mergeTarget.deleteOne()

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { _id, __v, ...displayContributor } = main.toJSON()

		res.json({
			message: "Successfully merged contributors",
			contributor: displayContributor
		})
		return
	}

	async getContributors(req: Request, res: Response): Promise<void> {
		const { error } = getContributors.validate(req.query)
		if (error) {
			res.status(400).json({
				message: error.message
			})
			return
		}

		async function getContributorsSpecificallyForProgram() {
			return await ProgramModel.aggregate([
				{
					"$match": {
						"_id": req.query.program
					}
				}, {
					"$lookup": {
						"from": "contributors",
						"localField": "contributors",
						"foreignField": "_id",
						"as": "contributors"
					}
				}, {
					"$project": {
						"_id": 0,
						"contributors": {
							"contributions": {
								"operations": 1
							},
							"name": 1,
							"identifier": 1,
							"createdAt": 1,
							"updatedAt": 1
						}
					}
				}, {
					"$unwind": "$contributors"
				}, {
					"$replaceWith": "$contributors"
				}, {
					"$addFields": {
						"contributionCount": {
							"$sum": [
								"$contributions.operations.creates", "$contributions.operations.updates", "$contributions.operations.deletes"
							]
						}
					}
				}, {
					"$sort": {
						"contributionCount": -1
					}
				}, {
					"$limit": 1000
				}
			])
		}

		async function getAllContributors() {
			return await ContributorModel.aggregate([
				{
					"$project": {
						"name": 1,
						"contributions": 1,
						"updatedAt": 1,
						"identifier": 1
					}
				}, {
					"$addFields": {
						"contributionCount": {
							"$sum": [
								"$contributions.operations.creates", "$contributions.operations.updates", "$contributions.operations.deletes"
							]
						}
					}
				}, {
					"$project": {
						"_id": 0,
						"name": 1,
						"contributions": {
							"operations": 1
						},
						"contributionCount": 1,
						"updatedAt": 1,
						"identifier": 1
					}
				},{
					"$sort": {
						"contributionCount": -1
					}
				}, {
					"$limit": 1000
				}
			])
		}

		res.json({
			message: "Successfully fetched contributors",
			contributors: req.query.program != null ?
				await getContributorsSpecificallyForProgram() :
				await getAllContributors()
		})
	}

	async contribute(fingerprint: string, operation: OperationType, type: ContentType): Promise<void> {
		// Check if user exists
		const response = await ContributorModel.findOne({
			identifier: fingerprint
		})

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
			identifier: [fingerprint]
		})

		// Save contributor
		await newContributor.save()
	}
}