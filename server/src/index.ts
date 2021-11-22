/**
 * Module dependencies.
 */
// const debug = require('debug')('quick-credit:server');
import debug from "debug"
import http from "http"
import RealTime from "./RealTime"
import configuredApp from "./app"

import { connectDB } from "./models/index.model"

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: string) => {
	const port = parseInt(val, 10)
	if (Number.isNaN(port)) {
		// named pipe
		return val
	}
	if (port >= 0) {
		// port number
		return port
	}
	return false
}
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || "8084")
configuredApp.set("port", port)
/**
 * Create HTTP server.
 */
const server = http.createServer(configuredApp)
RealTime.attach(server)
/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error: { syscall: string; code: string }) => {
	if (error.syscall !== "listen") {
		throw error
	}
	const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			console.log(`${bind} requires elevated privileges`)
			process.exit(1)
			break
		case "EADDRINUSE":
			console.log(`${bind} is already in use`)
			process.exit(1)
			break
		default:
			throw error
	}
}
/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
	const addr = server.address()
	if (addr === null)
		return
	const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`
	debug(`Listening on ${bind}`)
}
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => {
	console.log("Server listening on port test", port)
	connectDB()
})
server.on("error", onError)
server.on("listening", onListening)