import passport from "passport"
import express from "express"
import session from "express-session"
import { kthNodePassportUidcUser } from "@kth/kth-node-passport-oidc"
import UserModel from "../models/user.model"
import mongoose from "../models/index.model"
import { User } from "controllers"

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
			resave: true,
			saveUninitialized: false,
			cookie: {
				secure: process.env.NODE_ENV === "production"
			}
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

		// ? User doesn't exist in database
		else if (user) {
			const dbUser = await User.createUser(user.username)

			// Populate the express user with 
			// the the db user
			if (dbUser) {
				done(null, {
					id: dbUser._id,
					privilege: dbUser.privilege,
					settings: 0,
					displayName: user.displayName,
					username: user.username,
					memberOf: user.memberOf
				})
			}
			else {
				// If we fail to create the user then
				// we create a dummy session
				done(null, {
					id: new mongoose.Types.ObjectId(),
					privilege: 0,
					settings: 0,
					displayName: user.displayName,
					username: user.username,
					memberOf: user.memberOf
				})
			}
		}
		else
			done()
	})
}