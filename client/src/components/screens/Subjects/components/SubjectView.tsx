import React, { Component } from 'react'
import "./SubjectView.css"
import { Group, ContentObject, SubjectData } from '../Subjects'
import { v4 as uuid } from "uuid"
import logoutIcon from "../../../../assets/icons/close.svg"

export default class Subject extends Component<PropsForComponent> {

	constructor(props: PropsForComponent) {
		super(props)
	}

	_renderObject(object: ContentObject | Group, depth?: number) {
		if ((object as Group).group !== undefined || (object as Group).objects !== undefined) {
			const group: Group = object as Group
			return (
				<div key={uuid()} className={`GroupContainer${group.column ? " Column" : ""}${depth !== undefined && depth > 0 ? " Nested" : ""}${group.split !== undefined && group.split == false ? " NoBorder" : "" }`}>
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
				<div className="ButtonWrapper">
					<a key={uuid()} href={contentObject.link} className="Button">
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

	render() {
		return (
			<div className="SubjectWrapper">
				<div className="Scrollable">
					<img className="logoutIcon" onClick={this.props.close} src={logoutIcon} />
					<h2 className="HeaderSubjectView">{this.props.subject.title}</h2>
					<p className="Description">{this.props.subject.description}</p>
					<div className="LinkContainer">
						{this.props.subject.objects.map((object) => {
							return this._renderObject(object)
						})}
					</div>
				</div>
			</div>
		)
	}
}

export interface PropsForComponent {
	close: () => void,
	subject: SubjectData
}