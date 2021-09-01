import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux"
import { Link, useParams } from "react-router-dom"

import "./SubjectView.css"
import "components/screens/Subjects/components/Switch.css"
import { SubjectData } from "../Subjects/Subjects"
import RenderData from "components/templates/content_rendering/RenderData"
import logoutIcon from "assets/icons/close.svg"
import isMobile from "functions/isMobile"
import { IReduxRootState } from "state/reducers"
import { disableEditModeFlag, enableEditMode, IDisableEditModeFlag, IEnableEditMode } from "state/actions/app"
import { DataLoader } from 'functions/DataLoader'
import { IContentState } from 'state/reducers/content'
import NotFoundPage from '../404/404'

function SubjectView(props: PropsForComponent) {

	const scrollRef = useRef<HTMLDivElement>(null)

	const [hasLoaded, setHasLoaded] = useState(false)
	const [subject, setSubject] = useState<SubjectData>()
	const [editModeSwitchActive, setEditModeSwitchActive] = useState<boolean | undefined>(undefined)
	const { program, subjectCode } = useParams<IRouterParams>()

	useEffect(() => {
		DataLoader.manageProgramContentData(program).then((result) => {
			if (result.status === 1) {
				setHasLoaded(true)
				return
			}

			const subject = result.program.subjects.find(current => current.code === subjectCode)
			if (subject == null) {
				console.warn("Subject doesn't exist")
			}
			
			setSubject(subject)
			setHasLoaded(true)
		})

	}, [program, subjectCode])

	useEffect(() => {

		// Don't show edit mode for archived subjects
		if (props.editMode && subject?.archived)
			props.disableEditModeFlag()
	}, [props, subject])

	function _flickEditMode(event: React.ChangeEvent<HTMLInputElement>) {

		const checked = event.target.checked

		setEditModeSwitchActive(!!!props.editMode)

		if (checked)
			props.enableEditMode()
		else
			props.disableEditModeFlag()
	}

	if (subject == null && hasLoaded) {
		return <NotFoundPage />
	}

	if (subject == null) {
		return null
	}

	if (subject.group == null) {
		console.warn("Subject " + subject.name + " has no root")
		return (
			<div>
				<h2>This page is not working correctly</h2>
				<p>Course code: {subject.code}</p>
				<p>Please contact admin...</p>
			</div>
		)
	}

	return (
		<section className="SubjectViewMaster">
			<div className="SubjectWrapper">
				{isMobile() || subject.archived ? null :
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
					<Link to={`/${DataLoader.getActiveProgram()?.name ?? 404}${subject.archived ? "/archive" : ""}`}>
						<img className="logoutIcon" alt="Exit view" src={logoutIcon} />
					</Link>
					<h2 className="HeaderSubjectView">{subject.name}</h2>
					<p className="Description">{subject.description}</p>
					<div className="LinkContainer">
						<RenderData 
							updateSubjects={props.updateSubjects}
							group={subject.group}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

export interface PropsForComponent {
	content: IContentState
	editMode: boolean,
	enableEditMode: IEnableEditMode,
	disableEditModeFlag: IDisableEditModeFlag,
	updateSubjects: () => void
}

const reduxSelect = (state: IReduxRootState) => ({
	content: state.content,
	editMode: state.app.flags.editMode
})

const reduxDispatch = () => ({
	enableEditMode,
	disableEditModeFlag
})

export default connect(reduxSelect, reduxDispatch())(SubjectView)