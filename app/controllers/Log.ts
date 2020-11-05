import Log, { ContentType, OperationType } from "../models/log.model"
import Bcrypt from "bcrypt"

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

	// Generate ip hash password
	const salt = await Bcrypt.genSalt(2)
	const hashedIp = await Bcrypt.hash(ip, salt)

	const newLog = new Log({
		user: hashedIp,
		operation,
		to,
		type,
		from: from ?? []
	})

	newLog.save()
}

export default log