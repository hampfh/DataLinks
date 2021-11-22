declare module "@kth/kth-node-passport-oidc" {
	import express from "express"
	import passport from "passport"

	interface kthNodePassportUidcUser {
		username: string
		displayName: string
		email: string
		memberOf: Array<string>
	}

	interface kthRequestObject extends express.Request {
		user: kthNodePassportUidcUser
	}

	interface kthConnectConfig {
		configurationUrl: string
		clientId: string
		clientSecret: string
		tokenSecret: string
		callbackLoginUrl: string
		callbackLoginRoute: string
		callbackSilentLoginUrl?: string
		callbackSilentLoginRoute?: string
		callbackLogoutUrl?: string
		callbackLogoutRoute?: string
		defaultRedirect: string
		extendUser?: (user: kthNodePassportUidcUser, claims) => void
		log?: string
		setIsOwner?: boolean
	}

	class OpenIDConnect {
		constructor(server: express.Application, passport: passport, config: kthConnectConfig)

		login(req: express.Request, res: express.Response, next: express.NextFunction)
		silentLogin(req: express.Request, res: express.Response, next: express.NextFunction)
		logout(req: express.Request, res: express.Response, next: express.NextFunction)
	}
}