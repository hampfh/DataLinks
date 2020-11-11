import React, { Component } from 'react'
import { addLocal, deleteLocally, editLocal, IAddLocal, IDeleteLocally, IEditLocal } from 'state/actions/local'
import { IReduxRootState } from 'state/reducers'
import { ILocalState } from 'state/reducers/local'
import { connect } from "react-redux"
import Socket from "components/utilities/SocketManager"
import { ContentObject } from 'components/templates/RenderData'
import { ContentType } from 'App'

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
						let appendObject: ContentObject = {
							_id: data.id
						}

						if (data.type as ContentType === "TEXT") {
							const text = {
								_id: "NOTHING",
								title: data.fieldOne,
								text: data.fieldTwo
							}
							appendObject.text = text
						} else if (data.type as ContentType === "LINK") {
							const link = {
								_id: "NOTHING",
								displayText: data.fieldOne,
								link: data.fieldTwo
							}
							appendObject.link = link
						} else if (data.type as ContentType === "DEADLINE") {
							const deadlines = {
								_id: "NOTHING",
								displayText: data.fieldOne,
								deadline: data.fieldTwo,
								start: data.fieldThree
							}
							appendObject.deadline = deadlines
						}

						// Is the item local?
						if (this.props.local.added.find((element) => element.id?.toString() === data.id.toString()) != null) {
						
							this.props.editLocal(data.id, {
								id: data.id,
								title: data.type as ContentType === "TEXT" ? data.fieldOne : undefined,
								text: data.type as ContentType === "TEXT" ? data.fieldTwo : undefined,
								displayText: data.type as ContentType === "LINK" || data.type as ContentType === "DEADLINE" ? data.fieldOne : undefined,
								deadline: data.type as ContentType === "DEADLINE" ? data.fieldTwo : undefined,
								link: data.type as ContentType === "LINK" ? data.fieldTwo : undefined,
								start: data.type as ContentType === "DEADLINE" ? data.fieldThree : undefined
							})
						} else 
							this.props.updateRawData(appendObject)
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
	updateRawData: (newElement: ContentObject) => void
	local: ILocalState,
	addLocal: IAddLocal,
	deleteLocally: IDeleteLocally
	editLocal: IEditLocal
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		local: state.local
	}
}

const reduxDispatch = () => {
	return {
		addLocal,
		deleteLocally,
		editLocal
	}
}

export default connect(reduxSelect, reduxDispatch())(Subscriptions);