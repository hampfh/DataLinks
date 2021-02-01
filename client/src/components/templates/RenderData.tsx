/**
 * This file is responsible for the layout 
 * and distribution of all elements in the
 * subjects view. This file also sorts all
 * contentobjects provided by the database
 * and sorts them into their corresponding
 * modules. Aka sending all data belonging
 * to the text type to the text component
 * and vise verse for all other component-
 * types.
 * 
 * This is done by recursibly dive into the 
 * provided root object.
 */

import React, { useState } from 'react'
import { connect } from "react-redux"

import GroupForm from "./GroupForm"
import "./RenderData.css"
import { IReduxRootState } from "state/reducers"
import { 
	addLocal, 
	deleteLocally, 
	editLocal, 
	IAddLocal, 
	IDeleteLocally, 
	IEditLocal 
} from "state/actions/local"
import { ILocalState } from "state/reducers/local"
import { IAppState } from "state/reducers/app"
import RenderContent from './RenderContent'
import { onSubmitGroup } from 'functions/contentRequests'

function RenderData(props: PropsForComponent) {

	const [newGroup, setNewGroup] = useState<{
		parentGroup: string,
		name: string,
		isSubGroup: boolean
	} | undefined>(undefined)

	return (
		<div>
			{props.group.content.map((contentElement) => {
				return <RenderContent 
					key={contentElement._id}
					parentGroup={props.group._id}
					content={contentElement}
					updateSubjects={props.updateSubjects}
				/>
			})}
			<GroupForm 
				forRoot
				parentId={props.group._id}
				newGroup={newGroup}
				createGroup={(isSubGroup: boolean) => setNewGroup({
					name: "",
					parentGroup: props.group._id,
					isSubGroup
				})}
				submitGroup={(name: string) => onSubmitGroup(name, newGroup!, props.app.fingerprint!)}
			/>
		</div>
	)
}

interface PropsForComponent {
	app: IAppState,
	group: Group,
	local: ILocalState,
	deleteLocally: IDeleteLocally,
	addLocal: IAddLocal
	editLocal: IEditLocal,
	updateSubjects: () => void,
}


const reduxSelect = (state: IReduxRootState) => ({
	app: state.app,
	local: state.local,
})

const reduxDispatch = () => ({
	addLocal,
	deleteLocally,
	editLocal
})

export default connect(reduxSelect, reduxDispatch())(RenderData);