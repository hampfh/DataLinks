import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import Contributions, { IDB_Contributor } from "../models/contributions.model";
import { ContentType, OperationType } from "../models/log.model";
import { nameContributor } from "./schemas";
import Crypto from "crypto"
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

		const ip = req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string

		// Generate ip hash
		const ipHash = Crypto.createHash("sha512").update(ip, "utf8").digest("hex")

		const response = await Contributions.findOne({
			identifier: ipHash
		}) as Document & IDB_Contributor

		// Contributor doesn't exist, create new one
		if (response == null) {
			await Contributors.createNewContributor(ipHash, req.body.name)
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
	
	async contribute(ipHash: string, operation: OperationType, type: ContentType) {
		// Check if user exists
		const response = await Contributions.findOne({
			identifier: ipHash
		}) as Document & IDB_Contributor

		// This machine doesn't exist, create new
		if (response == null) {
			await Contributors.createNewContributor(ipHash, null, operation, type)
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
			hashedIdentifier: ipHash, 
			operation,
			type
		})
	}

	private static async createNewContributor(ipHash: string, name: string | null, operation?: OperationType, type?: ContentType) {
		const newContributor = new Contributions({
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
			identifier: ipHash
		} as IDB_Contributor)

		// Save contributor
		await newContributor.save()
	}
}