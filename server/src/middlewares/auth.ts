import { NextFunction, Request, Response } from "express"
import UserModel from "../models/user.model"
import { User } from "../controllers"
import { loginSchema } from "../controllers/schemas"
import moment from "moment"

export async function registerUserIfAbsentInDb(req: Request, res: Response, next: NextFunction): Promise<void> {
	const kthId = req.user?.username
	if (kthId == null) {
		console.error(`User is registred but has no kth id: ${req.user}, session: ${req.session}`)
		next()
		return
	}
	
	const userExists = await UserModel.exists({
		kthId: req.user?.username
	})

	if (!userExists) {
		const result = await User.createUser(kthId)
		if (result == null) {
			res.status(500).json({
				message: "Could not register new user"
			})
			return 
		}

		result.save()
	}
	next()
}

export async function updateLoginStats(req: Request, res: Response, next: NextFunction): Promise<void> {
	console.log("PING")
	if (req.user) {
		console.log(req.user, "HERE")
		try {
			await UserModel.updateOne({
				_id: req.user.id
			}, {
				$inc: {
					loginCount: 1
				},
				lastLogin: moment().toDate()
			})
		} catch (error) {
			console.warn(`Could not update login stats for: ${req.user.username}, error: ${error}`)
		}
	}
	
	next()
}

export async function loginRedirect(req: Request, res: Response): Promise<void> {
	const { error } = loginSchema.validate(req.query)
	if (error) {
		res.status(400).json({
			message: error.message
		})
		return 
	}

	if (req.query.redirect)
		res.redirect(req.query.redirect as string)
	else 
		res.redirect("/account")
}