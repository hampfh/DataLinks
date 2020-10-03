import React, { Component } from 'react'
import { ContentType } from '../../../../App'
import Http from '../../../../functions/HttpRequest'
import { ILink, IText } from '../../../templates/RenderData'

export default class ContentObject extends Component<PropsForComponent, StateForComponent> {

	newFieldOneRef: React.RefObject<HTMLInputElement>
	newFieldTwoRef: React.RefObject<HTMLInputElement>
	constructor(props: PropsForComponent) {
		super(props)

		this.newFieldOneRef = React.createRef()
		this.newFieldTwoRef = React.createRef()

		this.state = {
			lastFieldOne: (props.contentObject as IText).title ?? (props.contentObject as ILink).displayText ?? "",
			lastFieldTwo: (props.contentObject as IText).text ?? (props.contentObject as ILink).link ?? "",
			fieldOne: (props.contentObject as IText).title ?? (props.contentObject as ILink).displayText ?? "",
			fieldTwo: (props.contentObject as IText).text ?? (props.contentObject as ILink).link ?? ""
		}
	}

	_updateField = async (event: React.ChangeEvent<HTMLInputElement>, fieldOne: boolean) => {
		let newState = { ...this.state }
		if (fieldOne)
			newState.fieldOne = event.target.value
		else
			newState.fieldTwo = event.target.value
		this.setState(newState)
	}

	_updateContent = async () => {

		const fieldOne = this.newFieldOneRef.current?.value as string
		const fieldTwo = this.newFieldTwoRef.current?.value as string

		let newState = { ...this.state }
		newState.lastFieldOne = fieldOne
		newState.lastFieldTwo = fieldTwo
		this.setState(newState)

		let append: {
			parentGroup: string,
			id: string,
			title?: string,
			text?: string,
			displayName?: string,
			link?: string
		} = {
			parentGroup: this.props.parentId.toString(),
			id: this.props.id,
		}

		if (this.props.type === "Text") {
			append.title = fieldOne.length <= 0 ? "-" : fieldOne
			append.text = fieldTwo.length <= 0 ? "-" : fieldTwo
		} else {
			append.displayName = fieldOne.length <= 0 ? "-" : fieldOne
			append.link = fieldTwo.length <= 0 ? "-" : fieldTwo
		}
		
		console.log(append)

		const response = await Http({
			url: "/api/v1/group/textcontent",
			method: "PATCH",
			data: append
		})
		if (response.status !== 200) {
			if (window.confirm("The site encountered an error, reload the site?"))
				window.location.reload()
		}

		this.props.updateSubjects()
	}

	_delete = async () => {
		const response = await Http({
			url: "/api/v1/group/content",
			method: "DELETE",
			data: {
				parentGroupId: this.props.parentId,
				id: this.props.id
			}
		})

		if (response.status !== 200) {
			if (window.confirm("The site encountered an error, reload the site?"))
				window.location.reload()
		}

		this.props.deleteContent(this.props.id)
	}

	render() {
		if (!!!this.props.editMode) {
			if (this.props.type === "Text") {
				return (
					<div className="textObjectContainer">
						{this.state.fieldOne === undefined ? null :
							<h5 className="textObjectTitle">{this.state.fieldOne}</h5>
						}
						{this.state.fieldTwo === undefined ? null :
							<p className="textObject">{this.state.fieldTwo}</p>
						}
					</div>
				)
			} else {
				return (
					<div className="ButtonWrapper">
						<a href={this.state.fieldTwo} className="Button">
							{this.state.fieldOne}
						</a>
					</div>
				)
			}
		} else {
			return (
				<div className="ButtonWrapper">
					<label htmlFor="fieldOne">{this.props.type === "Text" ? "Title" : "Display text"}</label>
					<input ref={this.newFieldOneRef} disabled={this.props.id.toString().length === 0}
						name="fieldOne" value={this.state.fieldOne ?? ""}
						onChange={(event) => this._updateField(event, true)}
					/>
					<label htmlFor="fieldTwo">{this.props.type === "Text" ? "Text" : "Link"}</label>
					<input ref={this.newFieldTwoRef} disabled={this.props.id.toString().length === 0}
						name="fieldTwo" value={this.state.fieldTwo ?? ""}
						onChange={(event) => this._updateField(event, false)}
					/>
					{this.props.id.toString().length !== 0 && (
						this.state.lastFieldOne !== this.state.fieldOne || 
						this.state.lastFieldTwo !== this.state.fieldTwo
					) ? 
						<button onClick={this._updateContent}>Update fields</button>
						: null
					}
					{this.props.id.toString().length === 0 ? null :
						<button onClick={this._delete}>Delete</button>
					}
				</div>
			)
		}
	}
}

interface PropsForComponent {
	type: ContentType,
	parentId: string,
	id: string,
	editMode: boolean,
	contentObject: IText | ILink,
	updateSubjects: () => void,
	deleteContent: (id: string) => void
}

interface StateForComponent {
	lastFieldOne: string,
	lastFieldTwo: string,
	fieldOne: string,
	fieldTwo: string
}
