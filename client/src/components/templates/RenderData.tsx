import React, { Component } from 'react'
import { v4 as uuid } from "uuid"
import Http from '../../functions/HttpRequest'
import ContentElement from '../screens/Subject/components/ContentObject'
import { ContentType, AddedElement } from "../../App"

export default class RenderData extends Component<PropsForComponent, StateForComponent> {

	newFieldOneRef: React.RefObject<HTMLInputElement>
	newFieldTwoRef: React.RefObject<HTMLInputElement>
	constructor(props: PropsForComponent) {
		super(props)

		this.newFieldOneRef = React.createRef()
		this.newFieldTwoRef = React.createRef()

		this.state = {
			content: this.props.group.content
		}
	}

	shouldComponentUpdate() {
		return false
	}

	_deleteGroup = async (id: string) => {
		this.deleteContent(id)

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
	deleteContent = (id: string) => {
		this.props.addDeleted(id)
		this.forceUpdate()
	}

	_onCreateElement = (parentId: string, type: ContentType) => {
		if (type === "Group") {
			this._onSubmitElement({ parentId }, true)
		} else {
			let newState = { ...this.state }
			newState.newElement = {
				parentId: parentId,
				fieldOne: "",
				fieldTwo: "",
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

		const response = await Http({
			url: "/api/v1/group",
			method: "PATCH",
			data: updateObject
		})

		window.location.reload()
	}

	_onCreateRootGroup = async (id: string) => {
		console.log(await Http({
			url: "/api/v1/group",
			method: "POST",
			data: {
				parentGroup: id,
				split: false,
				column: false
			}
		}))
		window.location.reload()
	}

	// Take the virtual new element from the state and submit it to the database
	_onSubmitElement = async (alternative?: { parentId: string }, isGroup?: boolean) => {

		let appendObject: {
			parentGroup: string,
			title?: string,
			text?: string,
			displayText?: string,
			link?: string,
			placement: number
		} = {
			parentGroup: alternative?.parentId ?? this.state.newElement?.parentId as string,
			placement: 0
		}
		if (!!!isGroup && this.state.newElement?.type === "Text") {
			appendObject.title = this.newFieldOneRef.current?.value
			appendObject.text = this.newFieldTwoRef.current?.value
		} else if (!!!isGroup && this.state.newElement?.type === "Link") {
			appendObject.displayText = this.newFieldOneRef.current?.value
			appendObject.link = this.newFieldTwoRef.current?.value
		}

		// If it's a group then add it after the response (since we need the id)
		if (!!!isGroup) {
			this.props.addContent(
				alternative?.parentId ?? appendObject.parentGroup,
				appendObject.title as string ?? appendObject.displayText ?? "",
				appendObject.text as string ?? appendObject.link ?? "",
				isGroup !== undefined ? "Group" : this.state.newElement?.type as ContentType
			)
		}

		// Remove the temporary element
		let newState = { ...this.state }
		newState.newElement = undefined
		this.setState(newState)

		let urlSuffix: string = ""
		if (!!!isGroup && this.state.newElement?.type === "Text")
			urlSuffix = "/textcontent"
		else if (!!!isGroup && this.state.newElement?.type === "Link")
			urlSuffix = "/linkcontent"

		const response = await Http({
			url: "/api/v1/group" + urlSuffix,
			method: "POST",
			data: appendObject
		})

		if (isGroup) {
			this.props.addContent(
				alternative?.parentId ?? appendObject.parentGroup,
				appendObject.title as string ?? appendObject.displayText ?? response.group._id,
				appendObject.text as string ?? appendObject.link ?? "",
				isGroup !== undefined ? "Group" : this.state.newElement?.type as ContentType
			)
		}
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
						<h4 className="textObjectTitle"></h4> // Enable group names
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
								if (object.parentId === undefined)
									console.log(object)
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
							<div>
								<label htmlFor="fieldOne">{this.state.newElement.type === "Text" ? "Title" : "Display Text"}</label>
								<input ref={this.newFieldOneRef} name="fieldOne" placeholder={this.state.newElement.type === "Text" ? "New title" : "New display text"} />
								<label htmlFor="fieldTwo">{this.state.newElement.type === "Text" ? "Text" : "Link"}</label>
								<input ref={this.newFieldTwoRef} name="fieldTwo" placeholder={this.state.newElement.type === "Text" ? "New text" : "New link"}/>
								<button onClick={() => this._onSubmitElement()}>Submit content</button>
							</div> : null
						}
					</div>
					{this.props.editMode ? 
						<>
							<button onClick={() => this._onCreateElement(group._id, "Text")}>Add text</button>
							<button onClick={() => this._onCreateElement(group._id, "Link")}>Add link</button>
							<button onClick={() => this._onCreateElement(group._id, "Group")}>Add group</button>
							{group.depth > 1 ?
								<button onClick={() => this._deleteGroup(group._id)}>Delete group</button>
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
					type="Text"
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
		} else
			return null
	}

	render() {
		return (
			<div>
				{this.state.content.map((objects) => {
					return this.renderObject(objects, this.props.group._id)
				})}
				{this.props.editMode ? 
					<button onClick={() => this._onCreateRootGroup(this.props.group._id)}>Add group</button>
					: null
				}
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

interface StateForComponent {
	content: ContentObject[],
	newElement?: {
		parentId: string,
		fieldOne: string,
		fieldTwo: string,
		type: ContentType
	}
}