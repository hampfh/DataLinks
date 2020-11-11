import React, { Component } from 'react'
import { connect } from "react-redux"
import Moment from "moment"

import { ContentType } from "App"
import Http from "functions/HttpRequest"
import { IDeadline, ILink, IText } from "components/templates/RenderData"
import DeadlineObject from './DeadlineObject'
import "./ContentObject.css"
import { deleteLocally, editLocal, IDeleteLocally, IEditLocal, IEditLocalObject } from "state/actions/local"
import { IReduxRootState } from "state/reducers"
import { ILocalState } from "state/reducers/local"
import { IAppState } from "state/reducers/app"

class ContentObject extends Component<PropsForComponent, StateForComponent> {

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

		if (this.props.type === "DEADLINE" && fieldNum === "second" && !!!Moment(event.target.value).isValid()) {
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

		let append: IEditLocalObject = {
			parentGroup: this.props.parentId.toString(),
			id: this.props.id,
		}

		let urlPathPrefix = ""
		if (this.props.type === "TEXT") {
			urlPathPrefix = "textcontent"
			append.title = fieldOne.length <= 0 ? "-" : fieldOne
			append.text = fieldTwo.length <= 0 ? "-" : fieldTwo
		} else if (this.props.type === "LINK") {
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

		// Update is made with sockets, this code is redundant

		// Check if local item
		//if (indexOfLocal(this.props.local, append.id) >= 0)
		//	this.props.editLocal(append.id, append)
		//else if (this.props.updateSubjects)
		//	this.props.updateSubjects()
	}

	_delete = async () => {
		if (window.confirm("Are you sure you want to delete this item?")) {
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

			// Deletion is made with sockets
			//this.props.deleteLocally(this.props.id)
		}
	}

	render() {
		if (this.props.updateSubjects === undefined && (this.props.noEditMode === undefined || !!!this.props.noEditMode)) {
			if (process.env.NODE_ENV === "development")
				throw new Error("Must specify either updateSubjects or noEditMode")
			else
				return null;
		}
			
		if (!!!this.props.app.flags.editMode || this.props.noEditMode) {
			if (this.props.type === "TEXT") {
				return (
					<div className="textObjectWrapper">
						{this.state.fieldOne === undefined ? null :
							<h5 className="textObjectTitle">{this.state.fieldOne}</h5>
						}
						{this.state.fieldTwo === undefined ? null :
							<p className="textObject">{this.state.fieldTwo}</p>
						}
					</div>
				)
			} else if (this.props.type === "LINK") {
				return (
					<div className="ButtonWrapper">
						<a href={this.state.fieldTwo} className="Button">
							{this.state.fieldOne}
						</a>
					</div>
				)
			} else // Render deadline object
				return <DeadlineObject id={this.props.childId ?? this.props.id} displayText={this.state.fieldOne} deadline={this.state.fieldTwo} start={this.state.fieldThree} accent={this.props.accent} />
		} else {
			return (
				<div className="ButtonWrapper ButtonWrapperEditMode" style={{
					display: this.props.type === "DEADLINE" ? "grid" : "block"
				}}>
					<div className="editModeField">
						<label htmlFor="fieldOne" className="editLabel">{this.props.type === "TEXT" ? "Title" : this.props.type === "LINK" ? "Display text" : "Deadline description"}</label>
						<input className="editModeInputField" ref={this.newFieldOneRef} disabled={this.props.id.toString().length === 0}
							name="fieldOne" value={this.state.fieldOne ?? ""}
							onChange={(event) => this._updateField(event, "first")}
						/>
					</div>

					<div className="editModeField">
						{this.props.type === "DEADLINE" ?
							<p style={{
								color: this.state.fieldTwoIsCorrect ? "transparent" : "#fff",
								textDecoration: "underline",
								marginTop: "0",
								marginBottom: "0.1rem"
							}}>Deadline is not formatted correctly</p>
							: null
						}
						<label htmlFor="fieldTwo" className="editLabel">{this.props.type === "TEXT" ? "Text" : this.props.type === "LINK" ? "Link" : "Deadline (YYYY-MM-DD HH:mm)"}</label>
						<input className="editModeInputField" ref={this.newFieldTwoRef} disabled={this.props.id.toString().length === 0}
							name="fieldTwo" value={this.state.fieldTwo ?? ""}
							onChange={(event) => this._updateField(event, "second")}
							placeholder={this.props.type === "DEADLINE" ? "YYYY-MM-DD HH:mm" : ""}
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
	local: ILocalState,
	type: ContentType,
	parentId: string,
	id: string,
	childId?: string,
	app: IAppState,
	contentObject: IText | ILink | IDeadline,
	noEditMode?: boolean,
	accent?: boolean,
	updateSubjects?: () => void,
	deleteLocally: IDeleteLocally,
	editLocal: IEditLocal
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

const reduxSelect = (state: IReduxRootState) => {
	return {
		app: state.app,
		local: state.local
	}
}

const reduxDispatch = () => {
	return {
		deleteLocally,
		editLocal
	}
}

export default connect(reduxSelect, reduxDispatch())(ContentObject);