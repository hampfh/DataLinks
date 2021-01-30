import mongoose from "mongoose"
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// Set ES6 promises to mongoose default
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("mongoose").Promise = global.Promise

export function connectDB(): Promise<void> {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise<void>(async (resolve, reject) => {

		mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=${process.env.DB_AUTHSOURCE}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
			auth: process.env.NODE_ENV !== "production" ? undefined : {
				user: process.env.DB_USER as string,
				password: process.env.DB_PASS as string
			}
		})

		mongoose.connection.once("open", () => {
			console.log("DB connection is up!")
			resolve()
		}).on("error", (error: string) => {
			console.log("DB error: " + error)
			reject()
		})
	})
}

export function disconnectDB(): Promise<void> {
	return mongoose.disconnect()
}

export default mongoose