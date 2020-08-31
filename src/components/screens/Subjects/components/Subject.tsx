import React, { Component } from 'react'
import "./Subject.css"

export class Subject extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			collapsState: 0
		}
	}

	_onSubjectClick = () => {
		if (this.state.collapsState === 0) {
			this.setState({
				collapsState: 1
			})

			setTimeout(() => {
				this.setState({
					collapsState: 2
				})
			}, 200)
		} else if (this.state.collapsState === 2) {
			this.setState({
				collapsState: 0
			})
		}
	}

	render() {

		// Fully collapsed
		if (this.state.collapsState === 0) {
			return (
				<div className="Subject" style={{ backgroundColor: this.props.subject.color, height: "4rem" }} onClick={this._onSubjectClick}>
					<h4 className="Header">{this.props.subject.title}</h4>
				</div>
			)
		} else if (this.state.collapsState === 1) {
			return (
				<div className="Subject" style={{ backgroundColor: this.props.subject.color, height: "10rem" }}>
					<h4 className="Header" onClick={this._onSubjectClick}>{this.props.subject.title}</h4>
					<div className="LinkContainer" style={{ display: "none" }}>
						<a href={this.props.subject.meetingLink} className="Button">Join meeting</a>
						<a href={this.props.subject.subjectSite} className="Button">Go to site</a>
					</div>
				</div>
			)
		}
		else {
			return (
				<div className="Subject" style={{ backgroundColor: this.props.subject.color, height: "10rem" }}>
					<h4 className="Header" onClick={this._onSubjectClick}>{this.props.subject.title}</h4>
					<p className="Description">{this.props.subject.description}</p>
					<div className="LinkContainer">
						<a href={this.props.subject.meetingLink} className="Button">Join meeting</a>
						<a href={this.props.subject.subjectSite} className="Button">Go to site</a>
					</div>
				</div>
			)
		}
	}
}

export interface PropsForComponent {
	subject: {
		title: string,
		description: string,
		subjectSite: string,
		meetingLink: string,
		color: string
	}
}

export interface StateForComponent {
	collapsState: number
}

export default Subject
