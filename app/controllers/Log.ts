import Log, { ContentType, OperationType } from "../models/log.model"
import Crypto from "crypto"
import { Contributors } from "./";

const log = async (ip: string, operation: OperationType, type: ContentType, to: string[], from?: string[]) => {

	if (from !== undefined) {
		// Delete all things that hasn't changed
		if (to.length !== from.length)
			throw new Error("To and from are not equal length");

		// Remove changes that didn't happen
		for (let i = 0; i < to.length; i++) {
			if (to[i] === from[i]) {
				to.splice(i, 1);
				from.splice(i, 1);
			}
		}
	}

	// Generate ip hash
	const ipHash = Crypto.createHash("sha512").update(ip, "utf8").digest("hex")

	const newLog = new Log({
		user: ipHash,
		operation,
		to,
		type,
		from: from ?? []
	})

	await newLog.save()

	await Contributors.contribute(
		ipHash, 
		operation, 
		type
	)
}

export default log