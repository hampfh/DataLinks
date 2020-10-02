import React, { Component } from 'react'
import "./SubjectView.css"
import { SubjectData } from '../Subjects/Subjects'
import RenderData from "../../templates/RenderData"
import logoutIcon from "../../../assets/icons/close.svg"
import { Redirect } from "react-router-dom"

export default class Subject extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			shouldExitView: false
		}
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
						<div className="Scrollable">
							<img className="logoutIcon" onClick={this._clickExitView} alt="Exit view" src={logoutIcon} />
							<h2 className="HeaderSubjectView">{this.props.subject.name}</h2>
							<p className="Description">{this.props.subject.description}</p>
							<div className="LinkContainer">
								<RenderData 
									editMode={this.props.editMode}
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
	close: () => void,
	subject: SubjectData,
	editMode: boolean
}

export interface StateForComponent {
	shouldExitView: boolean
}