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
import { connect } from "react-redux"
import { v4 as uuid } from "uuid"
import Moment from "moment"

import Http from "functions/HttpRequest"
import ContentElement from "components/screens/Subject/components/ContentObject"
import { ContentType } from "App"
import GroupForm from "./GroupForm"
import "./RenderData.css"
import TemporaryFields from './TemporaryFields'
import { StateForComponent as NewElement } from "./TemporaryFields"
import { IReduxRootState } from "state/reducers"
import { 
	addLocal, 
	deleteLocally, 
	editLocal, 
	IAddLocal, 
	IDeleteLocally, 
	IEditLocal 
} from "state/actions/local"
import { ILocalState } from "state/reducers/local"
import { IAppState } from "state/reducers/app"

class RenderData extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			content: this.props.group.content
		}
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
	}

	// Target specific group, not all of them
	deleteContent = (id: string, ignoreConfirm?: boolean) => {
		if (ignoreConfirm || window.confirm("Are you sure you want to delete this?")) {
			this.props.deleteLocally(id)
		}
	}

	_onCreateElement = (parentId: string, type: "DEADLINE" | "TEXT" | "LINK") => {
		let newState = { ...this.state }
		newState.newElement = {
			parentId,
			type
		}
		this.setState(newState)
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
	_onSubmitElement = async (newElement: NewElement) => {

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
		if (newElement.type === "TEXT") {
			if (newElement.fieldOne.length !== 0)
				appendObject.title = newElement.fieldOne

			// Do not allow empty text
			if (newElement.fieldTwo.length === 0)
				return
			appendObject.text = newElement.fieldTwo
		} else if (newElement.type === "LINK") {

			// Do not allow empty displayName or link
			if (newElement.fieldOne.length === 0 || newElement.fieldTwo.length === 0)
				return

			appendObject.displayText = newElement.fieldOne
			appendObject.link = newElement.fieldTwo
		} else if (newElement.type === "DEADLINE") {

			// Do not allow empty date or wrong field
			if (newElement.fieldTwo.length === 0 || !!!newElement.fieldTwoCorrect) 
				return

			appendObject.displayText = newElement.fieldOne
			appendObject.deadline = Moment(newElement.fieldTwo).toDate().toString()
			appendObject.start = Moment().toDate().toString()
		}

		let urlSuffix: string = ""
		if (newElement.type === "TEXT")
			urlSuffix = "/textcontent"
		else if (newElement.type === "LINK")
			urlSuffix = "/linkcontent"
		else if (newElement.type === "DEADLINE")
			urlSuffix = "/deadlinecontent"

		// Remove the temporary element
		let newState = { ...this.state }
		newState.newElement = undefined
		this.setState(newState)

		await Http({
			url: "/api/v1/group" + urlSuffix,
			method: "POST",
			data: appendObject
		})

		//if (response.element._id != null) {
		//	this.props.addLocal(
		//		appendObject.parentGroup,
		//		appendObject.title ?? appendObject.displayText ?? "",
		//		appendObject.text ?? appendObject.link ?? appendObject.deadline ?? "",
		//		newElement.type === "DEADLINE" ? Moment().toString() : "",
		//		newElement.type,
		//		response.element._id
		//	)
		//}

	}

	renderObject(object: ContentObject, parentId: string, depth?: number) {
		if (object.group !== undefined) {

			// Check if group is deleted
			const groupId = this.props.local.deleted.find((deletedId: string) => deletedId.toString() === object.group?._id.toString())
			if (groupId != null || object.group == null)
				return null

			const group = object.group
			return (
				<div 
					key={object.group._id} 
					className={`GroupContainer${group.column ? " Column" : ""}
					${depth !== undefined && depth > 0 ? " Nested" : ""}
					${group.split !== undefined && group.split === false && !!!this.props.app.flags.editMode ? " NoBorder" : "" }`}
					style={this.props.app.flags.editMode ? {
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
							for (let i = 0; i < this.props.local.deleted.length; i++) {
								if (object._id.toString() === this.props.local.deleted[i].toString()) {
									deleted = true
									break
								}
							}
							if (deleted)
								return null
							return this.renderObject(object, group._id, depth !== undefined ? depth + 1 : 1)
						})}

						{// Generate all elements that are locally added
						this.props.local.added.map((object) => {
							let shouldAdd = false
							for (let i = 0; i < this.props.local.added.length; i++) {
								if (group._id.toString() === object.parentId.toString()) {
									shouldAdd = true
									break
								}
							}
							if (!!!shouldAdd)
								return null
							
							if (object.type === "GROUP") {
								const groupElement: ContentObject = {
									_id: group._id,
									group: {
										name: "",
										_id: object.fieldOne.toString(),
										depth: group.depth + 1,
										placement: 0,
										content: []
									}
								}
								return this.renderObject(groupElement, group._id)
							}
							else {
								let contentObject: IText | ILink | IDeadline
								if (object.type === "TEXT") {
									contentObject = {
										_id: object.id ?? "",
										title: object.fieldOne,
										text: object.fieldTwo
									}
								}
								else if (object.type === "LINK") {
									contentObject = {
										_id: object.id ?? "",
										displayText: object.fieldOne,
										link: object.fieldTwo
									}
								} else {
									contentObject = {
										_id: object.id ?? "",
										displayText: object.fieldOne,
										deadline: object.fieldTwo,
										start: object.fieldThree
									}
								}

								return (
									<ContentElement
										key={object.id ?? uuid()}
										type={object.type}
										parentId={group._id}
										id={object.id ?? ""}
										contentObject={contentObject}
										updateSubjects={this.props.updateSubjects}
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
					this.props.app.flags.editMode ?
						<>
							<button onClick={() => this._onCreateElement(group._id, "TEXT")}>Add text</button>
							<button onClick={() => this._onCreateElement(group._id, "LINK")}>Add link</button>
							<button onClick={() => this._onCreateElement(group._id, "DEADLINE")}>Add deadline</button>
							<GroupForm
								key={uuid()}
								forRoot={false}
								parentId={group._id}
								newGroup={this.state.newGroup}
								createGroup={this._onCreateGroup}
								submitGroup={this._onSubmitGroup}
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
					key={contentObject._id}
					type="LINK"
					parentId={parentId}
					id={contentObject._id}
					contentObject={contentObject.link}
					updateSubjects={this.props.updateSubjects}
				/>
			)
		}
		else if (contentObject.text !== undefined) {
			return <ContentElement 
				key={contentObject._id}
				type="TEXT"
				parentId={parentId}
				id={contentObject._id}
				contentObject={contentObject.text}
				updateSubjects={this.props.updateSubjects}
			/>
		} else if (contentObject.deadline?.deadline !== undefined) {
			return <ContentElement 
				key={contentObject._id}
				type="DEADLINE"
				parentId={parentId}
				id={contentObject._id}
				childId={contentObject.deadline._id}
				contentObject={contentObject.deadline}
				updateSubjects={this.props.updateSubjects}
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
					parentId={this.props.group._id}
					newGroup={this.state.newGroup}
					createGroup={this._onCreateGroup}
					submitGroup={this._onSubmitGroup}
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
	app: IAppState,
	group: Group,
	local: ILocalState,
	deleteLocally: IDeleteLocally,
	addLocal: IAddLocal
	editLocal: IEditLocal,
	updateSubjects: () => void,
}

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

const reduxSelect = (state: IReduxRootState) => {
	return {
		app: state.app,
		local: state.local,
	}
}

const reduxDispatch = () => {
	return {
		addLocal,
		deleteLocally,
		editLocal
	}
}

export default connect(reduxSelect, reduxDispatch())(RenderData);