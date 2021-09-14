import Log, { ContentType, OperationType } from "../models/log.model"
import { Contributors } from "./"

const log = async (fingerprint: string, operation: OperationType, type: ContentType, to: string[], from?: string[]): Promise<void> => {

	if (from !== undefined) {
		// Delete all things that hasn't changed
		if (to.length !== from.length)
			throw new Error("To and from are not equal length")

		// Remove changes that didn't happen
		for (let i = 0; i < to.length; i++) {
			if (to[i] === from[i]) {
				to.splice(i, 1)
				from.splice(i, 1)
			}
		}
	}

	const newLog = new Log({
		user: fingerprint,
		operation,
		to,
		type,
		from: from ?? []
	})

	await newLog.save()

	await Contributors.contribute(
		fingerprint, 
		operation, 
		type
	)
}

export default log