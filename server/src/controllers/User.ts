import { BeAnObject, IObjectWithTypegooseFunction } from "@typegoose/typegoose/lib/types"
import { Request, Response } from "express"
import { Document } from "mongoose"
import RealTime from "../RealTime"
import UserModel, { Privilege, User } from "../models/user.model"
import { CrudController } from "./CrudController"
import { getContributors, getUserSchema } from "./schemas"

export default class UserController extends CrudController {

	public async create(): Promise<void> {
		throw new Error("Not implemented")
	}

	public async createUser(kthId: string): Promise<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Document<any, BeAnObject, any> & User & IObjectWithTypegooseFunction & {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			_id: any;
		} 
	| null> {
		try {
			return new UserModel({
				kthId,
				loginCount: 0,
				lastLogin: new Date().toISOString(),
				privilege: Privilege.DEFAULT,
				settings: 0,
				contributions: {
					operations: {
						creates: 0,
						updates: 0,
						deletes: 0,
					},
					targets: {
						links: 0,
						texts: 0,
						deadlines: 0,
						groups: 0,
						subjects: 0
					}
				}
			})
		} catch (error) {
			console.warn(error)
			return null
		}
	}

	/** 
	 * Fetch a specific user with either the id or the kthId
	 * or fetch the current user associated with the active
	 * session if it exists
	 */
	public async read(req: Request, res: Response): Promise<void> {
		const { error } = getUserSchema.validate(req.query)
		if (error) {
			res.status(400).json({
				message: error.message
			})
			return
		}

		if ((req.query.id == null || req.query.kthId == null) && req.user == null) {
			res.status(404).json({
				message: "No such user, you must either be logged in or specify a specific user to fetch",
				user: undefined
			})
			return
		}

		const object: {
			_id?: string
			kthId?: string
		} = {}

		if (req.query.id) object._id = req.query.id.toString()
		else if (req.query.kthId) object.kthId = req.query.kthId.toString()
		else object._id = req.user!.id.toString()

		const user = await UserModel.findOne(object)
		if (!user) {
			res.status(404).json({
				message: "The specified user doesn't exist"
			})
			return
		}

		res.json({
			message: "Successfully fetched user",
			user: {
				id: user._id,
				kthId: user.kthId,
				loginCount: user.loginCount,
				lastLogin: user.lastLogin,
				privilege: user.privilege,
				settings: user.settings
			}
		})
	}

	public async contribute(userId: string, operation: string, type: string): Promise<void> {
		// Check if user exists
		const user = await UserModel.findOne({
			_id: userId
		})

		// If user doens't exist we exit
		if (user == null)
			return

		switch (operation) {
			case "CREATE":
				user.contributions.operations.creates++
				break
			case "UPDATE":
				user.contributions.operations.updates++
				break
			case "DELETE":
				user.contributions.operations.deletes++
				break
		}

		switch (type) {
			case "GROUP":
				user.contributions.targets.groups++
				break
			case "TEXT":
				user.contributions.targets.texts++
				break
			case "LINK":
				user.contributions.targets.links++
				break
			case "DEADLINE":
				user.contributions.targets.deadlines++
				break
			case "SUBJECT":
				user.contributions.targets.subjects++
				break
		}

		// Update contributor
		user.save()

		// TODO only emit to users on the /contributors page
		RealTime.emitToSockets("contribution", {
			name: user.kthId,
			identifier: user._id,
			operation,
			type
		})
	}

	async getContributors(req: Request, res: Response): Promise<void> {
		const { error } = getContributors.validate(req.query)
		if (error) {
			res.status(400).json({
				message: error.message
			})
			return
		}

		/*
			Fetch all users that have contributed
			with something, aka have more than
			0 contributions
		 */
		const contributors = await UserModel.aggregate([
			{
				"$project": {
					kthId: 1,
					contributions: 1,
					updatedAt: 1
				}
			}, {
				"$addFields": {
					contributionCount: {
						$sum: [
							"$contributions.operations.creates",
							"$contributions.operations.updates",
							"$contributions.operations.deletes"
						]
					}
				}
			}, {
				"$match": {
					contributionCount: { $gt: 0 }
				}
			}, {
				"$project": {
					_id: 0,
					kthId: 1,
					contributions: {
						operations: 1
					},
					contributionCount: 1,
					updatedAt: 1
				}
			},{
				"$sort": {
					contributionCount: -1
				}
			}, {
				"$limit": 1000
			}
		])

		res.json({
			message: "Successfully fetched contributors",
			contributors
		})
	}

	public update(): void {
		throw new Error("Method not implemented.")
	}
	public delete(): void {
		throw new Error("Method not implemented.")
	}
	
}