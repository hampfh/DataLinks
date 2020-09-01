import React, { Component } from 'react'
import "./Subject.css"
import { SubjectData, Group, ContentObject } from '../Subjects'
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

	_renderObject(object: ContentObject, collapseState: number) {
		if (object.link !== undefined) {
			return <a key={uuid()} href={(object as ContentObject).link} className="Button" style={
				{
					backgroundColor: collapseState === 0 ? "transparent" : object.color ?? "auto",
					color: collapseState === 0 ? "transparent" : "auto"
				}}>
				{(object as ContentObject).displayName}
			</a>
		}
		else if (object.text !== undefined) {
			return <div key={uuid()} className="textObjectContainer">
				<h5 className="textObjectTitle">{object.displayName}</h5>
				<p className="textObject">{object.text}</p>
			</div>
		}
	}

	render() {
		if (this.state.subject === undefined)
			return null

		return (
			<div className="Subject" style={{ backgroundColor: this.state.subject.color }}>
				<h4 className="Header" onClick={this._onSubjectClick}>{this.state.subject.title}</h4>
				{this.state.collapsState === 0 ? null :
					<section className="expandable" style={{
						maxHeight: this.state.collapsState > 0 ? "500px" : "0"
					}}>
						<p className="Description">{this.state.subject.description}</p>
						<div className="LinkContainer">
							{this.state.subject.objects.map((object) => {
								if ((object as Group).group !== undefined) {
									return (
										<section key={uuid()}>
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
