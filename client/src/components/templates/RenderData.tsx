import React, { Component } from 'react'
import { v4 as uuid } from "uuid"
import Http from '../../functions/HttpRequest'
import LinkObject from '../screens/Subject/components/LinkObject'
import TextObject from '../screens/Subject/components/TextObject'
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

	// Target specific group, not all of them
	deleteContent = (id: string) => {
		this.props.addDeleted(id)
		this.forceUpdate()
	}

	_onCreateElement = (parentId: string, type: "Text" | "Link") => {
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

	// Take the virtual new element from the state and submit it to the database
	_onSubmitElement = async () => {

		let appendObject: {
			parentGroup: string,
			title?: string,
			text?: string,
			displayText?: string,
			link?: string,
			placement: number
		} = {
			parentGroup: this.state.newElement?.parentId as string,
			placement: 0
		}
		if (this.state.newElement?.type === "Text") {
			appendObject.title = this.newFieldOneRef.current?.value
			appendObject.text = this.newFieldTwoRef.current?.value
		} else {
			appendObject.displayText = this.newFieldOneRef.current?.value
			appendObject.link = this.newFieldTwoRef.current?.value
		}

		this.props.addContent(
			appendObject.parentGroup,
			appendObject.title as string ?? appendObject.displayText,
			appendObject.text as string ?? appendObject.link,
			this.state.newElement?.type as "Text" | "Link"
		)

		let newState = { ...this.state }
		newState.newElement = undefined
		this.setState(newState)

		await Http({
			url: `/api/v1/group/${this.state.newElement?.type === "Text" ? "textcontent" : "linkcontent"}`,
			method: "POST",
			data: appendObject
		})

		this.forceUpdate()
	}

	renderObject(object: ContentObject, parentId: string, depth?: number) {
		if (object.group !== undefined) {
			const group = object.group
			return (
				<div key={uuid()} className={`GroupContainer${group.column ? " Column" : ""}${depth !== undefined && depth > 0 ? " Nested" : ""}${group.split !== undefined && group.split === false ? " NoBorder" : "" }`}>
					{group.group === undefined ? null :
						<h4 className="textObjectTitle"></h4> // Enable group names
					}
					<div className={`GroupItemContainer${group.column ? " Column" : ""}`}>
						{ // Generate all elements
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
							if (object.type === "Link") {
								return <LinkObject
									key={uuid()}
									parentId={parentId}
									id={""}
									editMode={this.props.editMode}
									linkObject={{
										_id: "",
										displayText: object.fieldOne,
										link: object.fieldTwo
									}}
									updateSubjects={this.props.updateSubjects}
									deleteContent={this.deleteContent}
								/>
							} else {
								return <TextObject
									key={uuid()}
									parentId={parentId}
									id={""}
									editMode={this.props.editMode}
									textObject={{
										_id: "",
										title: object.fieldOne,
										text: object.fieldTwo
									}}
									updateSubjects={this.props.updateSubjects}
									deleteContent={this.deleteContent}
								/>
							}
						})}
						{ // Temporary elements
						this.state.newElement !== undefined && group._id.toString() === this.state.newElement.parentId.toString() ?
							<div>
								<label htmlFor="fieldOne">{this.state.newElement.type === "Text" ? "Title" : "Display Text"}</label>
								<input ref={this.newFieldOneRef} name="fieldOne" placeholder={this.state.newElement.type === "Text" ? "New title" : "New display text"} />
								<label htmlFor="fieldTwo">{this.state.newElement.type === "Text" ? "Text" : "Link"}</label>
								<input ref={this.newFieldTwoRef} name="fieldTwo" placeholder={this.state.newElement.type === "Text" ? "New text" : "New link"}/>
								<button onClick={this._onSubmitElement}>Submit content</button>
							</div> : null
						}
					</div>
					<button onClick={() => this._onCreateElement(group._id, "Text")}>Add text</button>
					<button onClick={() => this._onCreateElement(group._id, "Link")}>Add link</button>
				</div>
			)
		}
		const contentObject = object
		if (contentObject.link !== undefined) {
			return (
				<LinkObject
					key={uuid()}
					parentId={parentId}
					id={contentObject._id}
					editMode={this.props.editMode}
					linkObject={contentObject.link}
					updateSubjects={this.props.updateSubjects}
					deleteContent={this.deleteContent}
				/>
			)
		}
		else if (contentObject.text !== undefined) {
			return <TextObject 
				key={uuid()}
				parentId={parentId}
				id={contentObject._id}
				editMode={this.props.editMode}
				textObject={contentObject.text}
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