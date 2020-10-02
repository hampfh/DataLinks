import React, { Component } from 'react'
import { v4 as uuid } from "uuid"

export default class RenderData extends Component<PropsForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		console.log(props.group)
	}

	renderObject(object: ContentObject, depth?: number) {
		if (object.group !== undefined) {
			const group = object.group
			return (
				<div key={uuid()} className={`GroupContainer${group.column ? " Column" : ""}${depth !== undefined && depth > 0 ? " Nested" : ""}${group.split !== undefined && group.split === false ? " NoBorder" : "" }`}>
					{group.group === undefined ? null :
						<h4 className="textObjectTitle">{group.placement}</h4>
					}
					<div className={`GroupItemContainer${group.column ? " Column" : ""}`}>
						{group.content.map((object) => {
							return this.renderObject(object, depth !== undefined ? depth + 1 : 1)
						})}
					</div>
				</div>
			)
		}
		const contentObject: ContentObject = object as ContentObject
		if (contentObject.link !== undefined) {
			return (
				<div key={uuid()} className="ButtonWrapper">
					<a href={contentObject.link.link} className="Button">
						{contentObject.link.displayText}
					</a>
				</div>
			)
		}
		else if (contentObject.text !== undefined) {
			return <div key={uuid()} className="textObjectContainer">
				{contentObject.text.title === undefined ? null :
					<h5 className="textObjectTitle">{contentObject.text.title}</h5>
				}
				{contentObject.text.text === undefined ? null :
					<p className="textObject">{contentObject.text.text}</p>
				}
			</div>
		} else
			return null
	}

	render() {
		return (
			<div>
				{this.props.group.content.map((objects) => {
					return this.renderObject(objects)
				})}
			</div>
		)
	}
}

export interface ILink {
	_id: string,
	displayText: string,
	link: string
}

export interface IText {
	_id: string,
	title: string,
	text: string
}

export interface ContentObject {
	_id: string,
	link?: ILink,
	text?: IText,
	group?: Group
}

export interface Group {
	_id: string,
	group: string,
	placement: number,
	content: Array<ContentObject>,
	column?: boolean,
	split?: boolean
}

interface PropsForComponent {
	editMode: boolean,
	group: Group
}