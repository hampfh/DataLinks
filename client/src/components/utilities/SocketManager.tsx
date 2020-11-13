import { Component } from 'react'
import socketIo from "socket.io-client"
const socket = process.env.NODE_ENV === "production" ?
	socketIo(`${process.env.REACT_APP_REMOTE_HOST}`) :
	socketIo()
	

export const socketEmit = (key: string, data: any) => socket.emit(key, data)

export default class SocketManager extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			multipleCallbacks: Array.isArray(this.props.callback)	
		}
	}

	componentDidMount() {
		socket.on(this.props.subscribeTo, this._onEvent)
	}

	componentWillUnmount() {
		socket.off(this.props.subscribeTo, this._onEvent)
	}

	_onEvent = (data: any) => this.props.callback(data)

	render() { return null }
}

interface PropsForComponent {
	subscribeTo: string,
	callback: (data: any) => void
}

interface StateForComponent {
	multipleCallbacks: boolean
}