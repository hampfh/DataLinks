import { NextFunction, Request, Response } from "express"
import UserModel from "../models/user.model"
import { redirectSchema } from "../controllers/schemas"
import moment from "moment"

export async function updateLoginStats(req: Request, res: Response, next: NextFunction): Promise<void> {
	if (req.user) {
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

export async function paramRedirect(req: Request, res: Response): Promise<void> {
	const { error } = redirectSchema.validate(req.query)
	if (error) {
		res.status(400).json({
			message: error.message
		})
		return 
	}

	if (req.query.redirect)
		res.redirect(req.query.redirect as string)
	else 
		res.redirect("/")
}