import React, { Component } from 'react'
import { v4 as uuid } from "uuid"
import LinkObject from '../screens/Subject/components/LinkObject'
import TextObject from '../screens/Subject/components/TextObject'

export default class RenderData extends Component<PropsForComponent> {

	renderObject(object: ContentObject, parentId: string, depth?: number) {
		if (object.group !== undefined) {
			const group = object.group
			return (
				<div key={uuid()} className={`GroupContainer${group.column ? " Column" : ""}${depth !== undefined && depth > 0 ? " Nested" : ""}${group.split !== undefined && group.split === false ? " NoBorder" : "" }`}>
					{group.group === undefined ? null :
						<h4 className="textObjectTitle"></h4> // Enable group names
					}
					<div className={`GroupItemContainer${group.column ? " Column" : ""}`}>
						{group.content.map((object) => {
							return this.renderObject(object, group._id, depth !== undefined ? depth + 1 : 1)
						})}
					</div>
				</div>
			)
		}
		const contentObject: ContentObject = object as ContentObject
		if (contentObject.link !== undefined) {
			if (!!!this.props.editMode) {
				return (
					<div key={uuid()} className="ButtonWrapper">
						<a href={contentObject.link.link} className="Button">
							{contentObject.link.displayText}
						</a>
					</div>
				)
			} else {
				return (
					<LinkObject 
						key={uuid()}
						parentId={parentId}
						id={contentObject._id}
						editMode={this.props.editMode} 
						linkObject={contentObject.link}
					/>
				)
			}
		}
		else if (contentObject.text !== undefined) {
			return <TextObject 
				key={uuid()}
				parentId={parentId}
				id={contentObject._id}
				editMode={this.props.editMode}
				textObject={contentObject.text}
			/>
		} else
			return null
	}

	render() {
		return (
			<div>
				{this.props.group.content.map((objects) => {
					return this.renderObject(objects, this.props.group._id)
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