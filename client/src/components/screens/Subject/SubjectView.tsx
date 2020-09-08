import React, { Component } from 'react'
import "./SubjectView.css"
import { Group, ContentObject, SubjectData } from '../Subjects/Subjects'
import { v4 as uuid } from "uuid"
import logoutIcon from "../../../assets/icons/close.svg"
import { Redirect } from "react-router-dom"

export default class Subject extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			shouldExitView: false
		}
	}

	_renderObject(object: ContentObject | Group, depth?: number) {
		if ((object as Group).group !== undefined || (object as Group).objects !== undefined) {
			const group: Group = object as Group
			return (
				<div key={uuid()} className={`GroupContainer${group.column ? " Column" : ""}${depth !== undefined && depth > 0 ? " Nested" : ""}${group.split !== undefined && group.split === false ? " NoBorder" : "" }`}>
					{group.group === undefined ? null :
						<h4 className="textObjectTitle">{group.group}</h4>
					}
					<div className={`GroupItemContainer${group.column ? " Column" : ""}`}>
						{group.objects.map((object) => {
							return this._renderObject(object, depth !== undefined ? depth + 1 : 1)
						})}
					</div>
				</div>
			)
		}
		const contentObject: ContentObject = object as ContentObject
		if (contentObject.link !== undefined) {
			return (
				<div key={uuid()} className="ButtonWrapper">
					<a href={contentObject.link} className="Button">
						{contentObject.displayName}
					</a>
				</div>
			)
		}
		else if (contentObject.text !== undefined) {
			return <div key={uuid()} className="textObjectContainer">
				{contentObject.displayName === undefined ? null :
					<h5 className="textObjectTitle">{contentObject.displayName}</h5>
				}
				{contentObject.text === undefined ? null :
					<p className="textObject">{contentObject.text}</p>
				}
			</div>
		} else
			return null
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
							<h2 className="HeaderSubjectView">{this.props.subject.title}</h2>
							<p className="Description">{this.props.subject.description}</p>
							<div className="LinkContainer">
								{this.props.subject.objects.map((object) => {
									return this._renderObject(object)
								})}
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
	subject: SubjectData
}

export interface StateForComponent {
	shouldExitView: boolean
}