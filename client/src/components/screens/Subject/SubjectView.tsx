import React, { Component, createRef } from 'react'
import "./SubjectView.css"
import "../Subjects/components/Switch.css"
import { SubjectData } from '../Subjects/Subjects'
import RenderData from "../../templates/RenderData"
import logoutIcon from "../../../assets/icons/close.svg"
import { Redirect } from "react-router-dom"
import isMobile from "../../../functions/isMobile"
import { connect } from 'react-redux'
import { IReduxRootState } from '../../../state/reducers'
import { IAppState } from '../../../state/reducers/app'
import { disableEditModeFlag, enableEditMode, IDisableEditModeFlag, IEnableEditMode } from '../../../state/actions/app'

class SubjectView extends Component<PropsForComponent, StateForComponent> {

	scrollRef: React.RefObject<HTMLInputElement>
	timeout?: NodeJS.Timeout
	constructor(props: PropsForComponent) {
		super(props)

		this.scrollRef = createRef()

		this.state = {
			shouldExitView: false,
		}
	}

	componentWillUnmount() {
		if (this.timeout)
			clearTimeout(this.timeout)
	}

	getSnapshotBeforeUpdate(prevProps: PropsForComponent, prevState: StateForComponent) {
		const scrollView = this.scrollRef.current
		if (scrollView == null)
			return null
		return scrollView.scrollHeight - scrollView.scrollTop
	}

	componentDidUpdate(prevProps: PropsForComponent, prevState: StateForComponent, snapshot: any) {
		// Set scroll
		if (snapshot !== null ) {
			const scrollView = this.scrollRef.current
			if (scrollView != null)
				scrollView.scrollTop = scrollView?.scrollHeight - snapshot
		}
	}

	_clickExitView = () => {
		const newState = { ...this.state }
		newState.shouldExitView = true
		this.setState(newState)
	}

	_flickEditMode = (event: React.ChangeEvent<HTMLInputElement>) => {

		const checked = event.target.checked
		let newState = { ...this.state }
		newState.checked = !!!this.props.app.flags.editMode
		this.setState(newState)

		if (this.timeout)
			clearTimeout(this.timeout)
		this.timeout = setTimeout(() => {
			if (checked)
				this.props.enableEditMode()
			else
				this.props.disableEditModeFlag()

			let newState = { ...this.state }
			newState.checked = undefined
			this.setState(newState)
		}, 100)
	}

	render() {
		if (this.props.subject.group == null) {
			console.warn("Subject " + this.props.subject.name + " has no root")
			return (<div>
				<h2>This page is not working correctly</h2>
				<p>Please contant admin...</p>
			</div>)
		}

		return (
			<section className="SubjectViewMaster">
				{this.state.shouldExitView ?
					<Redirect to="/" /> :
					<div className="SubjectWrapper">
						{isMobile() ? null :
							<div className="editModeContainer editModeCourse subjectViewEditMode">
								<p>Default mode</p>
								<label className="switch">
									<input onChange={(event) => this._flickEditMode(event)} checked={this.state.checked ?? this.props.app.flags.editMode} type="checkbox" />
									<span className="slider round"></span>
								</label>
								<p>Edit mode</p>
							</div>
						}
						<div className="Scrollable" ref={this.scrollRef}>
							<img className="logoutIcon" onClick={this._clickExitView} alt="Exit view" src={logoutIcon} />
							<h2 className="HeaderSubjectView">{this.props.subject.name}</h2>
							<p className="Description">{this.props.subject.description}</p>
							<div className="LinkContainer">
								<RenderData 
									updateSubjects={this.props.updateSubjects}
									group={this.props.subject.group}
								/>
							</div>
						</div>
					</div>

				}
			</section>
		)
	}
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