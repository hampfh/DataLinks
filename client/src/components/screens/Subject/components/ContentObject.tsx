import React, { Component } from 'react'
import { ContentType } from '../../../../App'
import Http from '../../../../functions/HttpRequest'
import { IDeadline, ILink, IText } from '../../../templates/RenderData'
import DeadlienObject from './DeadlineObject'
import Moment from "moment"
import "./ContentObject.css"

export default class ContentObject extends Component<PropsForComponent, StateForComponent> {

	newFieldOneRef: React.RefObject<HTMLInputElement>
	newFieldTwoRef: React.RefObject<HTMLInputElement>
	newFieldThreeRef: React.RefObject<HTMLInputElement>
	constructor(props: PropsForComponent) {
		super(props)

		this.newFieldOneRef = React.createRef()
		this.newFieldTwoRef = React.createRef()
		this.newFieldThreeRef = React.createRef()

		this.state = {
			lastFieldOne: (props.contentObject as IText).title ?? (props.contentObject as IDeadline).displayText ?? "",
			lastFieldTwo: (props.contentObject as IText).text ?? (props.contentObject as IDeadline).deadline ?? (props.contentObject as ILink).link ?? "",
			lastFieldThree: (props.contentObject as IDeadline).start ?? "",
			fieldOne: (props.contentObject as IText).title ?? (props.contentObject as ILink).displayText ?? "",
			fieldTwo: (props.contentObject as IText).text ?? (props.contentObject as IDeadline).deadline ?? (props.contentObject as ILink).link ?? "",
			fieldThree: (props.contentObject as IDeadline).start ?? "",
			fieldTwoIsCorrect: true
		}
	}

	_updateField = async (event: React.ChangeEvent<HTMLInputElement>, fieldNum: "first" | "second" | "third") => {
		let newState = { ...this.state }

		if (this.props.type === "Deadline" && fieldNum === "second" && !!!Moment(event.target.value).isValid()) {
			newState.fieldTwoIsCorrect = false;
		} else {
			newState.fieldTwoIsCorrect = true;
		}

		if (fieldNum === "first")
			newState.fieldOne = event.target.value
		else if (fieldNum === "second")
			newState.fieldTwo = event.target.value
		else
			newState.fieldThree = event.target.value
		this.setState(newState)
	}

	_updateContent = async () => {

		if (!!!this.state.fieldTwoIsCorrect)
			return

		const fieldOne = this.newFieldOneRef.current?.value as string
		const fieldTwo = this.newFieldTwoRef.current?.value as string
		const fieldThree = this.newFieldThreeRef.current?.value as string

		let newState = { ...this.state }
		newState.lastFieldOne = fieldOne
		newState.lastFieldTwo = fieldTwo
		newState.lastFieldThree = fieldThree
		this.setState(newState)

		let append: {
			parentGroup: string,
			id: string,
			title?: string,
			text?: string,
			displayText?: string,
			link?: string,
			deadline?: string,
			start?: string
		} = {
			parentGroup: this.props.parentId.toString(),
			id: this.props.id,
		}

		let urlPathPrefix = ""
		if (this.props.type === "Text") {
			urlPathPrefix = "textcontent"
			append.title = fieldOne.length <= 0 ? "-" : fieldOne
			append.text = fieldTwo.length <= 0 ? "-" : fieldTwo
		} else if (this.props.type === "Link") {
			urlPathPrefix = "linkcontent"
			append.displayText = fieldOne.length <= 0 ? "-" : fieldOne
			append.link = fieldTwo.length <= 0 ? "-" : fieldTwo
		} else {
			urlPathPrefix = "deadlinecontent"
			append.displayText = fieldOne.length <= 0 ? "-" : fieldOne
			append.deadline = fieldTwo.length <= 0 ? "-" : Moment(fieldTwo).toString()
			// This field should not be changed
			//append.start = fieldThree.length <= 0 ? "-" : fieldThree
		}
		
		const response = await Http({
			url: `/api/v1/group/${urlPathPrefix}`,
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
			} else if (this.props.type === "Link") {
				return (
					<div className="ButtonWrapper">
						<a href={this.state.fieldTwo} className="Button">
							{this.state.fieldOne}
						</a>
					</div>
				)
			} else // Render deadline object
				return <DeadlienObject displayText={this.state.fieldOne} deadline={this.state.fieldTwo} start={this.state.fieldThree} />
		} else {
			return (
				<div className="ButtonWrapper ButtonWrapperEditMode" style={{
					display: this.props.type === "Deadline" ? "grid" : "block"
				}}>
					<div className="editModeField">
						<label htmlFor="fieldOne" className="editLabel">{this.props.type === "Text" ? "Title" : this.props.type === "Link" ? "Display text" : "Deadline description"}</label>
						<input className="editModeInputField" ref={this.newFieldOneRef} disabled={this.props.id.toString().length === 0}
							name="fieldOne" value={this.state.fieldOne ?? ""}
							onChange={(event) => this._updateField(event, "first")}
						/>
					</div>

					<div className="editModeField">
						{this.props.type === "Deadline" ?
							<p style={{
								color: this.state.fieldTwoIsCorrect ? "transparent" : "#fff",
								textDecoration: "underline",
								marginTop: "0",
								marginBottom: "0.1rem"
							}}>Deadline is not formatted correctly</p>
							: null
						}
						<label htmlFor="fieldTwo" className="editLabel">{this.props.type === "Text" ? "Text" : this.props.type === "Link" ? "Link" : "Deadline (YYYY-MM-DD HH:mm)"}</label>
						<input className="editModeInputField" ref={this.newFieldTwoRef} disabled={this.props.id.toString().length === 0}
							name="fieldTwo" value={this.state.fieldTwo ?? ""}
							onChange={(event) => this._updateField(event, "second")}
							placeholder={this.props.type === "Deadline" ? "YYYY-MM-DD HH:mm" : ""}
						/>
					</div>
					<div className="buttonContainerEditMode">
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
	contentObject: IText | ILink | IDeadline,
	updateSubjects: () => void,
	deleteContent: (id: string) => void
}

interface StateForComponent {
	lastFieldOne: string,
	lastFieldTwo: string,
	lastFieldThree: string,
	fieldOne: string,
	fieldTwo: string,
	fieldThree: string,
	fieldTwoIsCorrect: boolean,
}
