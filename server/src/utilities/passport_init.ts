import passport from "passport"
import express from "express"
import session from "express-session"
import { kthNodePassportUidcUser } from "@kth/kth-node-passport-oidc"
import UserModel from "../models/user.model"
import mongoose from "../models/index.model"
import { User } from "../controllers"
import Redis from "redis"
import connectRedis from "connect-redis"

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

	if (process.env.NODE_ENV === "production") {
		const RedisStore = connectRedis(session)

		// Configure redis client
		const redisClient = Redis.createClient()

		redisClient.on("error", error => {
			console.warn(`Redis connection error: ${error}`)
		})
		redisClient.on("connect", () => {
			console.log("Connected to redis successfully")
		})

		server.set("trust proxy", 1) // trust first proxy
		server.use(
			session({
				store: new RedisStore({ client: redisClient }),
				secret: process.env.SESSION_SECRET as string,
				resave: false,
				saveUninitialized: false,
				cookie: {
					httpOnly: true,
					// ? For the cookie to be readable by KTH server
					// ? it cannot be secure
					secure: false,
					maxAge: 2419200000 // One month 1000 * 60 * 60 * 24 * 7 * 4
				}
			})
		)
	} else {
		server.use(
			session({
				secret: "secret",
				resave: false,
				saveUninitialized: false
			})
		)
	}

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
				dbUser.save()
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