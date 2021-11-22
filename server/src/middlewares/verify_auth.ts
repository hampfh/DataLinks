import { NextFunction, Request, Response } from "express"
import { Privilege } from "../models/user.model"

export function isAuthorized(req: Request): boolean {
	return req.user != null
}

export function blockIfNotAuthorized(req: Request, res: Response, next: NextFunction): void {
	if (isAuthorized(req)) {
		next()
		return
	}
	res.status(401).json({
		message: "Access denied, no auth session"
	})
}

export function requiresModeratorPrivilege(req: Request, res: Response, next: NextFunction): void {
	if (!req.user) {
		res.status(401).json({
			message: "No user session"
		})
		return
	}

	if (req.user?.privilege < Privilege.MODERATOR) {
		res.status(403).json({
			message: "No valid privilege"
		})
		return
	}

	next()
	return
}

export function requiresAdminEditToken(req: Request, res: Response, next: NextFunction): void {
	
	if (req.body.adminEditToken == null ||
		req.body.adminEditToken != process.env.ADMIN_EDIT_TOKEN) {
		res.status(403).json({
			message: "Unauthorized access, only admins have access to this resource"
		})
		return
	}

	next()
}