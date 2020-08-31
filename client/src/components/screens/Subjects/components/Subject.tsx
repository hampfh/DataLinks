import React, { Component } from 'react'
import "./Subject.css"
import { SubjectData } from '../Subjects'
import { v4 as uuid } from "uuid"

export class Subject extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			collapsState: 0,
			subject: props.subject
		}
	}

	_onSubjectClick = () => {
		if (this.state.collapsState === 0) {
			const newState = { ...this.state }
			newState.collapsState = 1
			this.setState(newState)

			setTimeout(() => {
				const newState = { ...this.state }
				newState.collapsState = 2
				this.setState(newState)
			}, 200)
		} else if (this.state.collapsState === 2) {
			const newState = { ...this.state }
			newState.collapsState = 0
			this.setState(newState)
		}
	}

	render() {
		if (this.state.subject === undefined)
			return null

		// Fully collapsed
		if (this.state.collapsState === 0) {
			return (
				<div className="Subject" style={{ backgroundColor: this.state.subject.color, height: "4rem" }} onClick={this._onSubjectClick}>
					<h4 className="Header">{this.state.subject.title}</h4>
				</div>
			)
		} else if (this.state.collapsState === 1) {
			return (
				<div className="Subject" style={{ backgroundColor: this.state.subject.color, height: "10rem" }}>
					<h4 className="Header" onClick={this._onSubjectClick}>{this.state.subject.title}</h4>
					<div className="LinkContainer" style={{ display: "none" }}>
						{this.state.subject.links.map((link) => {
							return <a key={uuid()} href={link.value} className="Button">{link.displayName}</a>
						})}
					</div>
				</div>
			)
		}
		else {
			return (
				<div className="Subject" style={{ backgroundColor: this.state.subject.color, height: "10rem" }}>
					<h4 className="Header" onClick={this._onSubjectClick}>{this.state.subject.title}</h4>
					<p className="Description">{this.state.subject.description}</p>
					<div className="LinkContainer">
						{this.state.subject.links.map((link) => {
							return <a key={uuid()} href={link.value} className="Button">{link.displayName}</a>
						})}
					</div>
				</div>
			)
		}
	}
}

export interface StateForComponent {
	collapsState: number,
	subject: SubjectData | undefined
}

export interface PropsForComponent {
	subject: SubjectData
}

export default Subject
