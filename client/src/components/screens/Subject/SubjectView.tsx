import React, { Component, createRef } from 'react'
import "./SubjectView.css"
import "../Subjects/components/Switch.css"
import { SubjectData } from '../Subjects/Subjects'
import RenderData from "../../templates/RenderData"
import logoutIcon from "../../../assets/icons/close.svg"
import { Redirect } from "react-router-dom"
import { AddedElement, ContentType } from '../../../App'
import isMobile from "../../../functions/isMobile"

export default class Subject extends Component<PropsForComponent, StateForComponent> {

	scrollRef: React.RefObject<HTMLInputElement>
	constructor(props: PropsForComponent) {
		super(props)

		this.scrollRef = createRef()

		this.state = {
			shouldExitView: false,
			editMode: props.editMode
		}
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
		let newState = { ...this.state }
		newState.editMode = event.target.checked;
		this.setState(newState)
		const checked = event.target.checked
		setTimeout(() => {
			this.props.setEditMode(checked)
		}, 200)
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
							<div className="editModeContainer editModeCourse">
								<p>Default mode</p>
								<label className="switch">
									<input onChange={(event) => this._flickEditMode(event)} checked={this.state.editMode} type="checkbox" />
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
									editMode={this.props.editMode}
									group={this.props.subject.group}
									added={this.props.added}
									deleted={this.props.deleted}
									addDeleted={this.props.addDeleted}
									addContent={this.props.addContent}
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
	setEditMode: (mode: boolean) => void,
	addContent: (id: string, fieldOne: string, fieldTwo: string, type: ContentType) => void
	addDeleted: (id: string) => void
	updateSubjects: () => void,
	close: () => void,
	subject: SubjectData,
	editMode: boolean,
	deleted: string[],
	added: AddedElement[]
}

export interface StateForComponent {
	shouldExitView: boolean,
	editMode: boolean
}