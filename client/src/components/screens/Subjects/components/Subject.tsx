import React, { Component } from 'react'
import "./Subject.css"
import "./Animation.css"
import { SubjectData, Group, ContentObject } from '../Subjects'
import { v4 as uuid } from "uuid"

export class Subject extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			collapsState: localStorage.getItem(this.props.subject.title) == null ? 0 : 3,
			subject: props.subject
		}
	}

	_onSubjectClick = () => {
		// Extend the subject container
		if (this.state.collapsState === 0) {
			const newState = { ...this.state }
			newState.collapsState = 3
			this.setState(newState)

			// Add subject to localstorage
			if (this.state.subject !== undefined)
				localStorage.setItem(this.state.subject?.title, "1")
		// Collapse the subject container
		} else if (this.state.collapsState === 3) {
			const newState = { ...this.state }
			newState.collapsState = 0
			this.setState(newState)

			if (this.state.subject !== undefined)
				localStorage.removeItem(this.state.subject?.title)
		}
	}

	_renderObject(object: ContentObject, collapseState: number) {
		if (object.link !== undefined) {
			return <a key={uuid()} href={object.link} className="Button" style={
				{
					backgroundColor: collapseState === 0 ? "transparent" : object.color ?? "auto",
					color: collapseState === 0 ? "transparent" : "auto"
				}}>
				{object.displayName}
			</a>
		}
		else if (object.text !== undefined) {
			return <div key={uuid()} className="textObjectContainer">
				{object.displayName === undefined ? null : 
					<h5 className="textObjectTitle">{object.displayName}</h5>
				}
				{object.text === undefined ? null : 
					<p className="textObject">{object.text}</p>
				}
			</div>
		} else
			return null
	}

	render() {
		if (this.state.subject === undefined)
			return null

		return (
			<div className={"Subject"} style={{ backgroundColor: this.state.subject.color }}>
				<h4 className="Header" onClick={this._onSubjectClick}>{this.state.subject.title}</h4>
				{this.state.collapsState === 0 ? null :
					<section className="expandable" style={{
						maxHeight: this.state.collapsState > 0 ? "none" : "0"
					}}>
						<p className="Description">{this.state.subject.description}</p>
						<div className="LinkContainer">
							{this.state.subject.objects.map((object) => {
								if ((object as Group).group !== undefined) {
									return (
										<section className="groupContainer" key={uuid()}>
											<h4 className="subTitle">{(object as Group).group}</h4>
											<div className="nestedLinkContainer">
												{(object as Group).objects.map((object) => {
													return this._renderObject(object, this.state.collapsState)
												})}
											</div>
										</section>
									)
								} else
									return this._renderObject(object as ContentObject, this.state.collapsState)
							})}
						</div>
					</section>
				}
			</div>
		)
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
