import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux"
import { Link } from "react-router-dom"

import "./SubjectView.css"
import "components/screens/Subjects/components/Switch.css"
import { SubjectData } from "../Subjects/Subjects"
import RenderData from "components/templates/content_rendering/RenderData"
import logoutIcon from "assets/icons/close.svg"
import isMobile from "functions/isMobile"
import { IReduxRootState } from "state/reducers"
import { disableEditModeFlag, enableEditMode, IDisableEditModeFlag, IEnableEditMode } from "state/actions/app"

function SubjectView(props: PropsForComponent) {

	const scrollRef = useRef<HTMLDivElement>(null)

	const [editModeSwitchActive, setEditModeSwitchActive] = useState<boolean | undefined>(undefined)

	useEffect(() => {

		// Don't show edit mode for archived subjects
		if (props.editMode && props.subject.archived)
			props.disableEditModeFlag()
	}, [props])

	function _flickEditMode(event: React.ChangeEvent<HTMLInputElement>) {

		const checked = event.target.checked

		setEditModeSwitchActive(!!!props.editMode)

		if (checked)
			props.enableEditMode()
		else
			props.disableEditModeFlag()
	}

	if (props.subject.group == null) {
		console.warn("Subject " + props.subject.name + " has no root")
		return (
			<div>
				<h2>This page is not working correctly</h2>
				<p>Please contact admin...</p>
			</div>
		)
	}

	return (
		<section className="SubjectViewMaster">
			<div className="SubjectWrapper">
				{isMobile() || props.subject.archived ? null :
					<div className="editModeContainer editModeCourse subjectViewEditMode">
						<p>Default mode</p>
						<label className="switch">
							<input onChange={(event) => _flickEditMode(event)} checked={editModeSwitchActive ?? props.editMode} type="checkbox" />
							<span className="slider round"></span>
						</label>
						<p>Edit mode</p>
					</div>
				}
				<div className="Scrollable" ref={scrollRef}>
					<Link to={`/D20${props.subject.archived ? "/archive" : ""}`}>
						<img className="logoutIcon" alt="Exit view" src={logoutIcon} />
					</Link>
					<h2 className="HeaderSubjectView">{props.subject.name}</h2>
					<p className="Description">{props.subject.description}</p>
					<div className="LinkContainer">
						<RenderData 
							updateSubjects={props.updateSubjects}
							group={props.subject.group}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

export interface PropsForComponent {
	enableEditMode: IEnableEditMode,
	disableEditModeFlag: IDisableEditModeFlag,
	updateSubjects: () => void,
	subject: SubjectData,
	editMode: boolean,
}

export interface StateForComponent {
	shouldExitView: boolean,
	checked?: boolean
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		editMode: state.app.flags.editMode
	}
}

const reduxDispatch = () => {
	return {
		enableEditMode,
		disableEditModeFlag
	}
}

export default connect(reduxSelect, reduxDispatch())(SubjectView)