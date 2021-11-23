import passport from "passport"
import { kthConnectConfig, OpenIDConnect } from "@kth/kth-node-passport-oidc"
import app from "../express_init"

export class OpenId {
	public instance: OpenIDConnect

	constructor() {
		const host = process.env.HOST as string
		const port = process.env.NODE_ENV === "production" ? 443 : process.env.PORT as string
		const config: kthConnectConfig = {
			configurationUrl: process.env.KTH_LOGIN_CONFIGURATION_URL as string,
			clientId: process.env.KTH_LOGIN_ID as string,
			clientSecret: process.env.KTH_LOGIN_SECRET as string,
			tokenSecret: process.env.KTH_TOKEN_SECRET as string,
			callbackLoginUrl: `${host}:${port}/api/login/callback`,
			callbackLoginRoute: "/api/login/callback",
			callbackSilentLoginUrl: `${host}:${port}/api/silentlogin/callback`,
			callbackSilentLoginRoute: "/api/silentlogin/callback",
			callbackLogoutUrl: `${host}:${port}/api/logout/callback`,
			callbackLogoutRoute: "/api/logout/callback",
			defaultRedirect: "/"
		}

		this.instance = new OpenIDConnect(app, passport, config)
	}
}

export const oidc = new OpenId().instance