import React, { Component } from 'react'
import Moment from "moment"
import { ContentType } from "App"

export default class TemporaryFields extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			parentId: this.props.parentId,
			fieldOne: "",
			fieldTwo: "",
			fieldTwoCorrect: true,
			fieldThree: "",
			type: this.props.type
		}
	}

	_checkTemporaryField = (event: React.ChangeEvent<HTMLInputElement>, field: "first" | "second") => {

		let newState = { ...this.state }

		const validDate = Moment(event.currentTarget.value).isValid()

		if (newState.type === "Deadline" && field === "second" &&
			validDate !== this.state.fieldTwoCorrect) {
			// Invert field
			newState.fieldTwoCorrect = validDate;
		}

		// Update field
		if (field === "first")
			newState.fieldOne = event.target.value
		else if (field === "second")
			newState.fieldTwo = event.target.value

		this.setState(newState)
	}

	_submitFields = () => {
		if (this.state.fieldTwoCorrect && this.state.fieldTwo.length > 0)
			this.props.onSubmitElement(this.state)
		else {
			let newState = { ...this.state }
			newState.fieldTwoCorrect = false;
			this.setState(newState)
		}
	}

	render() {
		return (
			<div className="tempNewFieldsWrapper">
				<div className="tempNewFieldsContainer">
					<label htmlFor="fieldOne">{this.state.type === "Text" ? "Title" : this.state.type === "Link" ? "Link" : "Text"}</label>
					<input
						name="fieldOne"
						placeholder={this.state.type === "Text" ? "New title" : "New display text"}
						onChange={(event) => this._checkTemporaryField(event, "first")}
						value={this.state.fieldOne}
					/>

					{this.state.type === "Deadline" ?
						<p style={{
							color: this.state.fieldTwoCorrect ? "transparent" : "#fff",
							textDecoration: "underline",
							marginBottom: "0.1rem"
						}}>Deadline is not formatted correctly</p>
						: null
					}
					<label htmlFor="fieldTwo">{this.state.type === "Text" ? "Text" : this.state.type === "Link" ? "Link" : "Deadline (YYYY-MM-DD HH:mm)"}</label>
					<input
						name="fieldTwo" placeholder={this.state.type === "Text" ? "New text" : this.state.type === "Link" ? "New link" : "YYYY-MM-DD HH:mm"}
						onChange={(event) => this._checkTemporaryField(event, "second")}
						value={this.state.fieldTwo}
					/>
					<button onClick={this._submitFields}>Submit content</button>
				</div>
			</div>
		)
	}
}

interface PropsForComponent {
	parentId: string,
	type: ContentType,
	onSubmitElement: (newElement: StateForComponent, isGroup?: boolean | undefined) => Promise<void>
}

export interface StateForComponent {
	parentId: string,
	fieldOne: string,
	fieldTwo: string,
	fieldTwoCorrect: boolean,
	fieldThree: string,
	type: ContentType
}