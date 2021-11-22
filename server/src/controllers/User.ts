import { BeAnObject, IObjectWithTypegooseFunction } from "@typegoose/typegoose/lib/types"
import { Request, Response } from "express"
import { isAuthorized } from "../middlewares/verify_auth"
import { Document } from "mongoose"
import RealTime from "../RealTime"
import UserModel, { Privilege, User } from "../models/user.model"
import { CrudController } from "./CrudController"
import { getUserSchema } from "./schemas"

export default class SubjectController extends CrudController {

	getAuthSession(req: Request, res: Response): void {
		if (!isAuthorized(req)) {
			res.status(401).json({
				message: "No active session, not authorized"
			})
			return
		}
	
		res.status(200).json({
			message: "Successfully fetched active login session",
			user: {
				kthId: req.user?.username
			}
		})
	}

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

	public async read(req: Request, res: Response): Promise<void> {
		const { error } = getUserSchema.validate(req.query)
		if (error) {
			res.status(400).json({
				message: error.message
			})
			return
		}

		const object: {
			_id?: string
			kthId?: string
		} = {}

		if (req.query.id) object._id = req.query.id as string
		else if (req.query.kthId) object.kthId = req.query.kthId as string

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

	public update(): void {
		throw new Error("Method not implemented.")
	}
	public delete(): void {
		throw new Error("Method not implemented.")
	}
	
}