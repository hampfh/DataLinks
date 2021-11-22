import passport from "passport"
import express from "express"
import session from "express-session"
import { kthNodePassportUidcUser } from "@kth/kth-node-passport-oidc"
import UserModel from "../models/user.model"

type DoneFunction<T extends Express.User | kthNodePassportUidcUser> = (paramOne?: unknown, user?: T) => void

async function populateUserFromDB(user: kthNodePassportUidcUser): Promise<Express.User | null> {
	const response = await UserModel.findOne({
		kthId: user.username
	}).lean()

	if (response == null)
		return null

	return {
		id: response._id,
		username: user.username,
		displayName: user.displayName,
		privilege: response.privilege,
		settings: response.settings,
		memberOf: user.memberOf
	}
}

export async function initPassport(server: express.Application): Promise<void> {
	server.set("trust proxy", 1) // trust first proxy
	server.use(
		session({
			secret: process.env.SESSION_SECRET as string,
			resave: false,
			saveUninitialized: true
		})
	)

	server.use(passport.initialize())
	server.use(passport.session())

	passport.serializeUser((user: Express.User, done: DoneFunction<Express.User>) => {
		if (user)
			done(null, user)
		else
			done()
	})

	passport.deserializeUser(async (user: kthNodePassportUidcUser, done: DoneFunction<Express.User>) => {

		const populatedUser = await populateUserFromDB(user)

		if (populatedUser)
			done(null, populatedUser)
		else
			done()
	})
}