import { Component } from 'react'
import socketIo from "socket.io-client"
const socket = socketIo()

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

	_onEvent = () => {
		if (this.state.multipleCallbacks) {
			for (let i = 0; i < this.props.callback.length; i++) 
				(this.props.callback as unknown as [() => void])[i]()
		} else
			this.props.callback()
	}

	render() { return null }
}

interface PropsForComponent {
	subscribeTo: string,
	callback: () => void | [() => void]
}

interface StateForComponent {
	multipleCallbacks: boolean
}