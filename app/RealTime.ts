import http from "http"
import * as socketIo from "socket.io"

class RealTime {

	private attached: boolean
	private io: socketIo.Server

	constructor() {
		this.attached = false
		this.io = new socketIo.Server()
	}

	attach(server: http.Server) {
		this.attached = true
		this.io.attach(server)
	}

	subscribe = (event: string, callback: () => void) => {
		this.io.on(event, callback)
	}
	unsubscribe = (event: string, callback: () => void) => {
		this.attached && this.io.off(event, callback)
	}
	unsubscribeEvent = (event: string) => {
		this.attached && this.io.removeAllListeners(event)
	}
	unsubscribeAll = () => {
		this.attached && this.io.removeAllListeners()
	}

	emit = (event: string, data: unknown) => {
		this.attached && this.io.emit(event, data)
	}
	emitToSockets = (event: string, data: unknown) => {
		this.attached && this.io.sockets.emit(event, data)
	}
}

export default new RealTime()