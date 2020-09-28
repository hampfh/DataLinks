import React, { Component } from 'react'
import { v4 as uuid } from "uuid"

export default class RenderData extends Component<PropsForComponent> {

	renderObject(object: ContentObject | Group, depth?: number) {
		if ((object as Group).group !== undefined || (object as Group).objects !== undefined) {
			const group: Group = object as Group
			return (
				<div key={uuid()} className={`GroupContainer${group.column ? " Column" : ""}${depth !== undefined && depth > 0 ? " Nested" : ""}${group.split !== undefined && group.split === false ? " NoBorder" : "" }`}>
					{group.group === undefined ? null :
						<h4 className="textObjectTitle">{group.group}</h4>
					}
					<div className={`GroupItemContainer${group.column ? " Column" : ""}`}>
						{group.objects.map((object) => {
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

	render() {
		return (
			<div>
				{this.props.objects.map((objects) => {
					return this.renderObject(objects)
				})}
			</div>
		)
	}
}

export interface ContentObject {
	displayName: string,
	link?: string,
	text?: string,
	color: string
}

export interface Group {
	group: string,
	objects: Array<ContentObject>,
	column?: boolean,
	split?: boolean
}

interface PropsForComponent {
	objects: Array<ContentObject | Group>
}