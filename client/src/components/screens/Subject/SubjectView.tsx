import { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { useParams } from "react-router-dom"

import "./SubjectView.css"
import "components/screens/Subjects/components/Switch.css"
import { SubjectData } from "../Subjects/Subjects"
import RenderData from "components/templates/content_rendering/RenderData"
import { IReduxRootState } from "state/reducers"
import { disableEditModeFlag, IDisableEditModeFlag } from "state/actions/app"
import { DataLoader } from 'functions/DataLoader'
import { IContentState } from 'state/reducers/content'
import NotFoundPage from '../404/404'
import CourseHeader from './components/CourseHeader'

function SubjectView(props: PropsForComponent) {

	const [hasLoaded, setHasLoaded] = useState(false)
	const [subject, setSubject] = useState<SubjectData>()
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
		<section className="subject-container">
			<CourseHeader isArchived={subject.archived}  />
			<RenderData 
				updateSubjects={props.updateSubjects}
				group={subject.group}
			/>
		</section>
	)
}

export interface PropsForComponent {
	content: IContentState
	editMode: boolean,
	updateSubjects: () => void
	disableEditModeFlag: IDisableEditModeFlag
}

const reduxSelect = (state: IReduxRootState) => ({
	content: state.content,
	editMode: state.app.flags.editMode
})

const reduxDispatch = () => ({
	disableEditModeFlag
})

export default connect(reduxSelect, reduxDispatch())(SubjectView)