/**
 * This file is responsible to the layout 
 * and distribution of all elements in the
 * subjects view. This file also sorts all
 * contentobjects provided by the database
 * and sorts them into their corresponding
 * modules. Aka sending all data belonging
 * to the text type to the text component
 * and vise verse for all other component-
 * types.
 * 
 * This is done by recursibly dive into the 
 * provided root object.
 */

import React, { Component } from 'react'
import { v4 as uuid } from "uuid"
import Http from '../../functions/HttpRequest'
import ContentElement from '../screens/Subject/components/ContentObject'
import { ContentType, AddedElement } from "../../App"
import GroupForm from "./GroupForm"
import Moment from "moment"
import "./RenderData.css"
import TemporaryFields from './TemporaryFields'
import { StateForComponent as NewElement } from "./TemporaryFields"

export default class RenderData extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			content: this.props.group.content
		}
	}

	shouldComponentUpdate() {
		return false
	}

	_deleteGroup = async (id: string) => {
		if (!!!window.confirm("Are you sure you want to delete this group, all it's children will also be deleted")) 
			return
		this.deleteContent(id, true)

		const response = await Http({
			url: "/api/v1/group",
			method: "DELETE",
			data: {
				id
			}
		})

		if (response.status !== 200) {
			if (window.confirm("An error occured, would you like to reload the site?"))
				window.location.reload()
		}
		this.forceUpdate()
	}

	// Target specific group, not all of them
	deleteContent = (id: string, ignoreConfirm?: boolean) => {
		if (ignoreConfirm || window.confirm("Are you sure you want to delete this?")) {
			this.props.addDeleted(id)
			this.forceUpdate()
		}
	}

	_onCreateElement = (parentId: string, type: ContentType) => {
		if (type === "Group") {
			this._onSubmitElement({ 
				parentId, 
				fieldOne: "",
				fieldTwo: "",
				fieldTwoCorrect: true,
				fieldThree: "",
				type,
			}, true)
		} else {
			let newState = { ...this.state }
			newState.newElement = {
				parentId,
				type
			}
			this.setState(newState)
			this.forceUpdate()
		}
	}

	_updateGroup = async (id: string, setting: "split" | "column" | "placement", value: boolean | number) => {

		let updateObject: {
			id: string,
			split?: boolean,
			column?: boolean,
			placement?: number
		} = {
			id
		}

		if (setting === "split")
			updateObject.split = value as boolean
		else if (setting === "column")
			updateObject.column = value as boolean
		else if (setting === "placement")
			updateObject.placement = value as number

		await Http({
			url: "/api/v1/group",
			method: "PATCH",
			data: updateObject
		})

		window.location.reload()
	}

	_onCreateGroup = async (id: string, isSubGroup: boolean) => {
		let newState = { ...this.state }
		newState.newGroup = {
			name: "",
			parentGroup: id,
			isSubGroup
		}
		this.setState(newState)
		this.forceUpdate()
	}

	_onSubmitGroup = async (name: string) => {

		let submitObject: {
			name?: string,
			parentGroup: string,
			split: boolean,
			column: boolean
		} = {
			parentGroup: this.state.newGroup?.parentGroup as string,
			split: false,
			column: false
		}

		if (name != null && name.length !== 0)
			submitObject.name = name

		await Http({
			url: "/api/v1/group",
			method: "POST",
			data: submitObject
		})
		window.location.reload()
	}

	// Take the virtual new element from the state and submit it to the database
	_onSubmitElement = async (newElement: NewElement, isGroup?: boolean) => {

		let appendObject: {
			parentGroup: string,
			title?: string,
			text?: string,
			displayText?: string,
			link?: string,
			deadline?: string,
			start?: string,
			placement: number
		} = {
			parentGroup: newElement.parentId ?? this.state.newElement?.parentId,
			placement: 0
		}
		if (!!!isGroup && newElement.type === "Text") {
			if (newElement.fieldOne.length !== 0)
				appendObject.title = newElement.fieldOne

			// Do not allow empty text
			if (newElement.fieldTwo.length === 0)
				return
			appendObject.text = newElement.fieldTwo
		} else if (!!!isGroup && newElement.type === "Link") {

			// Do not allow empty displayName or link
			if (newElement.fieldOne.length === 0 || newElement.fieldTwo.length === 0)
				return

			appendObject.displayText = newElement.fieldOne
			appendObject.link = newElement.fieldTwo
		} else if (!!!isGroup && newElement.type === "Deadline") {

			// Do not allow empty date or wrong field
			if (newElement.fieldTwo.length === 0 || !!!newElement.fieldTwoCorrect) 
				return

			appendObject.displayText = newElement.fieldOne
			appendObject.deadline = Moment(newElement.fieldTwo).toDate().toString()
			appendObject.start = Moment().toDate().toString()
		}

		// If it's a group then add it after the response (since we need the id)
		if (!!!isGroup) {
			this.props.addContent(
				appendObject.parentGroup,
				appendObject.title as string ?? appendObject.displayText ?? "",
				appendObject.text as string ?? appendObject.link ?? "",
				isGroup !== undefined ? "Group" : newElement.type as ContentType
			)
		}

		// Remove the temporary element
		let newState = { ...this.state }
		newState.newElement = undefined
		this.setState(newState)

		let urlSuffix: string = ""
		if (!!!isGroup && newElement.type === "Text")
			urlSuffix = "/textcontent"
		else if (!!!isGroup && newElement.type === "Link")
			urlSuffix = "/linkcontent"
		else if (!!!isGroup && newElement.type === "Deadline")
			urlSuffix = "/deadlinecontent"

		await Http({
			url: "/api/v1/group" + urlSuffix,
			method: "POST",
			data: appendObject
		})

		this.forceUpdate()
	}

	_forceUpdateMe = () => {
		this.forceUpdate()
	}

	renderObject(object: ContentObject, parentId: string, depth?: number) {
		if (object.group !== undefined) {

			// Check if group is deleted
			const groupId = this.props.deleted.find((deletedId: string) => deletedId.toString() === object.group?._id.toString())
			if (groupId != null || object.group == null)
				return null

			const group = object.group
			return (
				<div 
					key={uuid()} 
					className={`GroupContainer${group.column ? " Column" : ""}${depth !== undefined && depth > 0 ? " Nested" : ""}${group.split !== undefined && group.split === false && !!!this.props.editMode ? " NoBorder" : "" }`}
					style={this.props.editMode ? {
						margin: "1rem",
						borderStyle: "solid",
						borderWidth: "3px",
						borderColor: "#FFF"
					} : undefined}
				>
					{group.name === undefined ? null :
						<h4 className="textObjectTitle">{group.name}</h4> // Enable group names
					}
					<div className={`GroupItemContainer${group.column ? " Column" : ""}`}>
						{ // Generate all elements and ignore the ones that are deleted
						group.content.map((object) => {
							let deleted = false
							for (let i = 0; i < this.props.deleted.length; i++) {
								if (object._id.toString() === this.props.deleted[i].toString()) {
									deleted = true
									break
								}
							}
							if (deleted)
								return null
							return this.renderObject(object, group._id, depth !== undefined ? depth + 1 : 1)
						})}

						{// Generate all elements that are locally added
						this.props.added.map((object) => {
							let shouldAdd = false
							for (let i = 0; i < this.props.added.length; i++) {
								if (group._id.toString() === object.parentId.toString()) {
									shouldAdd = true
									break
								}
							}
							if (!!!shouldAdd)
								return null
							
							if (object.type === "Group") {
								const test: ContentObject = {
									_id: group._id,
									group: {
										name: "",
										_id: object.fieldOne.toString(),
										depth: group.depth + 1,
										placement: 0,
										content: []
									}
								}
								return this.renderObject(test, group._id)
							}
							else {
								return (
									<ContentElement
										key={uuid()}
										type={object.type}
										parentId={parentId}
										id={""}
										editMode={this.props.editMode}
										contentObject={(object.type === "Text" ? {
											_id: "",
											title: object.fieldOne,
											text: object.fieldTwo
										} : {
												_id: "",
												displayText: object.fieldOne,
												link: object.fieldTwo
											})}
										updateSubjects={this.props.updateSubjects}
										deleteContent={this.deleteContent}
									/>
								)	
							}
						})}

						{ // Temporary elements
						this.state.newElement !== undefined && group._id.toString() === this.state.newElement.parentId.toString() ?
							<TemporaryFields 
								onSubmitElement={this._onSubmitElement} 
								type={this.state.newElement.type} 
								parentId={group._id}
							/> : null
						}
					</div>
					{ // Control panel for group
					this.props.editMode ?
						<>
							<button onClick={() => this._onCreateElement(group._id, "Text")}>Add text</button>
							<button onClick={() => this._onCreateElement(group._id, "Link")}>Add link</button>
							<button onClick={() => this._onCreateElement(group._id, "Deadline")}>Add deadline</button>
							<GroupForm
								key={uuid()}
								forRoot={false}
								editMode={this.props.editMode}
								parentId={group._id}
								newGroup={this.state.newGroup}
								createGroup={this._onCreateGroup}
								submitGroup={this._onSubmitGroup}
								forceUpdateMe={this._forceUpdateMe}
							/>
							{group.depth > 1 ?
								<button onClick={() => this._deleteGroup(group._id)}>Delete this group</button>
								: null
							}
							<div>
								<button onClick={() => this._updateGroup(group._id, "split", !group.split)}>{group.split ? "Disable" : "Enable"} split</button>
								<button onClick={() => this._updateGroup(group._id, "column", !group.column)}>{group.column ? "Disable" : "Enable"} column</button>
							</div>
						</>
						: null}
				</div>
			)
		}
		const contentObject = object
		if (contentObject.link !== undefined) {
			return (
				<ContentElement
					key={uuid()}
					type="Link"
					parentId={parentId}
					id={contentObject._id}
					editMode={this.props.editMode}
					contentObject={contentObject.link}
					updateSubjects={this.props.updateSubjects}
					deleteContent={this.deleteContent}
				/>
			)
		}
		else if (contentObject.text !== undefined) {
			return <ContentElement 
				key={uuid()}
				type="Text"
				parentId={parentId}
				id={contentObject._id}
				editMode={this.props.editMode}
				contentObject={contentObject.text}
				updateSubjects={this.props.updateSubjects}
				deleteContent={this.deleteContent}
			/>
		} else if (contentObject.deadline?.deadline !== undefined) {
			return <ContentElement 
				key={uuid()}
				type="Deadline"
				parentId={parentId}
				id={contentObject._id}
				editMode={this.props.editMode}
				contentObject={contentObject.deadline}
				updateSubjects={this.props.updateSubjects}
				deleteContent={this.deleteContent}
			/>
		}
			return null
	}

	render() {
		return (
			<div>
				{this.state.content.map((objects) => {
					return this.renderObject(objects, this.props.group._id)
				})}
				<GroupForm 
					forRoot
					editMode={this.props.editMode}
					parentId={this.props.group._id}
					newGroup={this.state.newGroup}
					createGroup={this._onCreateGroup}
					submitGroup={this._onSubmitGroup}
					forceUpdateMe={this._forceUpdateMe}
				/>
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

export interface IDeadline {
	_id: string,
	displayText: string,
	deadline: string,
	start: string
}

export interface ContentObject {
	_id: string,
	link?: ILink,
	text?: IText,
	deadline?: IDeadline,
	group?: Group
}


export interface Group {
	_id: string,
	name: string,
	depth: number,
	placement: number,
	content: Array<ContentObject>,
	column?: boolean,
	split?: boolean
}

interface PropsForComponent {
	updateSubjects: () => void,
	editMode: boolean,
	group: Group,
	deleted: string[],
	added: AddedElement[]
	addDeleted: (id: string) => void,
	addContent: (id: string, fieldOne: string, fieldTwo: string, type: ContentType) => void
}

export 

interface StateForComponent {
	content: ContentObject[],
	newGroup?: {
		name: string,
		parentGroup: string,
		isSubGroup: boolean
	},
	newElement?: {
		parentId: string,
		type: ContentType
	}
}