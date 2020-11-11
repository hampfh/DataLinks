import React, { Component } from 'react'
import { addLocal, deleteLocally, IAddLocal, IDeleteLocally } from 'state/actions/local'
import { IReduxRootState } from 'state/reducers'
import { ILocalState } from 'state/reducers/local'
import { connect } from "react-redux"
import Socket from "components/utilities/SocketManager"

class Subscriptions extends Component<PropsForComponent> {
	render() {
		return (
			<>
				<Socket subscribeTo="newElement" callback={(data: any) => {
						this.props.addLocal(
							data.parent, 
							data.fieldOne, 
							data.fieldTwo, 
							data.fieldThree, 
							data.type, 
							data.id
						)
					}} 
				/>
				<Socket subscribeTo="updateElement" callback={(data: any) => {
						// Delete old node and replace with new
						this.props.deleteLocally(data.id)
						this.props.addLocal(
							data.parent,
							data.fieldOne,
							data.fieldTwo,
							data.fieldThree,
							data.type,
							data.id
						)
					}} 
				/>
				<Socket subscribeTo="deleteElement" callback={(data: any) => {
						// Delete old node
						this.props.deleteLocally(data.id)
					}}
				/>
			</>
		)
	}
}

export interface PropsForComponent {
	local: ILocalState,
	addLocal: IAddLocal,
	deleteLocally: IDeleteLocally
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		local: state.local
	}
}

const reduxDispatch = () => {
	return {
		addLocal,
		deleteLocally
	}
}

export default connect(reduxSelect, reduxDispatch())(Subscriptions);