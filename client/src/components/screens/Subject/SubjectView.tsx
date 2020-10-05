import React, { Component } from 'react'
import "./SubjectView.css"
import { SubjectData } from '../Subjects/Subjects'
import RenderData from "../../templates/RenderData"
import logoutIcon from "../../../assets/icons/close.svg"
import { Redirect } from "react-router-dom"
import { AddedElement, ContentType } from '../../../App'

export default class Subject extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			shouldExitView: false
		}
	}

	componentWillUnmount() {
		
	}

	_clickExitView = () => {
		const newState = { ...this.state }
		newState.shouldExitView = true
		this.setState(newState)
	}

	render() {
		return (
			<section className="Master">
				{this.state.shouldExitView ?
					<Redirect to="/" /> :
					<div className="SubjectWrapper">
						<div>
							<button onClick={() => this.props.setEditMode(!!!this.props.editMode)}>{this.props.editMode ? "Default mode" : "Edit mode"}</button>
						</div>
						<div className="Scrollable">
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
	shouldExitView: boolean
}