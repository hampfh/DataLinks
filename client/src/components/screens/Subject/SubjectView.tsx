import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"

import "./SubjectView.css"
import "components/screens/Subjects/components/Switch.css"
import { SubjectData } from "../Subjects/Subjects"
import RenderData from "components/templates/content_rendering/RenderData"
import logoutIcon from "assets/icons/close.svg"
import isMobile from "functions/isMobile"
import { IReduxRootState } from "state/reducers"
import { IAppState } from "state/reducers/app"
import { disableEditModeFlag, enableEditMode, IDisableEditModeFlag, IEnableEditMode } from "state/actions/app"

function SubjectView(props: PropsForComponent) {

	const scrollRef = useRef(null)
	let timeout: NodeJS.Timeout | undefined = undefined

	const [shouldExitView, setShouldExitView] = useState(false)
	const [editModeSwitchActive, setEditModeSwitchActive] = useState<boolean | undefined>(undefined)

	useEffect(() => {
		
		return () => {
			if (timeout)
				clearTimeout(timeout)
		}
	}, [timeout])

	/* getSnapshotBeforeUpdate(prevProps: PropsForComponent, prevState: StateForComponent) {
		const scrollView = this.scrollRef.current
		if (scrollView == null)
			return null
		return scrollView.scrollHeight - scrollView.scrollTop
	} */

	/* componentDidUpdate(prevProps: PropsForComponent, prevState: StateForComponent, snapshot: any) {
		// Set scroll
		if (snapshot !== null ) {
			const scrollView = this.scrollRef.current
			if (scrollView != null)
				scrollView.scrollTop = scrollView?.scrollHeight - snapshot
		}
	} */

	function _flickEditMode(event: React.ChangeEvent<HTMLInputElement>) {

		const checked = event.target.checked

		setEditModeSwitchActive(!!!props.app.flags.editMode)
		if (timeout)
			clearTimeout(timeout)

		timeout = setTimeout(() => {
			if (checked)
				props.enableEditMode()
			else
				props.disableEditModeFlag()
		}, 100)
	}

	if (props.subject.group == null) {
		console.warn("Subject " + props.subject.name + " has no root")
		return (<div>
			<h2>This page is not working correctly</h2>
			<p>Please contant admin...</p>
		</div>)
	}

	return (
		<section className="SubjectViewMaster">
			{shouldExitView ?
				<Redirect to="/" /> :
				<div className="SubjectWrapper">
					{isMobile() ? null :
						<div className="editModeContainer editModeCourse subjectViewEditMode">
							<p>Default mode</p>
							<label className="switch">
								<input onChange={(event) => _flickEditMode(event)} checked={editModeSwitchActive ?? props.app.flags.editMode} type="checkbox" />
								<span className="slider round"></span>
							</label>
							<p>Edit mode</p>
						</div>
					}
					<div className="Scrollable" ref={scrollRef}>
						<img className="logoutIcon" onClick={() => setShouldExitView(true)} alt="Exit view" src={logoutIcon} />
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

			}
		</section>
	)
}

export interface PropsForComponent {
	enableEditMode: IEnableEditMode,
	disableEditModeFlag: IDisableEditModeFlag,
	updateSubjects: () => void,
	subject: SubjectData,
	app: IAppState,
}

export interface StateForComponent {
	shouldExitView: boolean,
	checked?: boolean
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		app: state.app
	}
}

const reduxDispatch = () => {
	return {
		enableEditMode,
		disableEditModeFlag
	}
}

export default connect(reduxSelect, reduxDispatch())(SubjectView)