import React, { useState } from 'react'
import Moment from "moment"
import { ContentType } from 'components/utilities/content_type'
import "./TemporaryFields.css"

export default function TemporaryField({ parentId, type, onSubmitElement, onCancel }: PropsForComponent) {

	const [fieldOne, setFieldOne] = useState("")
	const [fieldTwo, setFieldTwo] = useState("")
	const [fieldTwoCorrect, setFieldTwoCorrect] = useState(true)

	function _checkTemporaryField(event: React.ChangeEvent<HTMLInputElement>, field: "first" | "second") {

		const validDate = Moment(event.currentTarget.value).isValid()

		if (type === "DEADLINE" && field === "second" && validDate !== fieldTwoCorrect) {
			// Invert field
			setFieldTwoCorrect(validDate)
		}

		// Update field
		if (field === "first")
			setFieldOne(event.target.value)
		else if (field === "second")
			setFieldTwo(event.target.value)
	}

	function _submitFields() {
		if (fieldTwoCorrect && fieldTwo.length > 0) {
			onSubmitElement({
				parentId,
				fieldOne,
				fieldTwo,
				fieldTwoCorrect,
				fieldThree: "",
				type
			})
			return
		}
		
		setFieldTwoCorrect(false)
	}

	return (
		<div className="tempNewFieldsWrapper">
			<div className="tempNewFieldsContainer">
				<label className="temporaryLabel" htmlFor="fieldOne">{type === "TEXT" ? "Title" : type === "LINK" ? "Link" : "Text"}</label>
				<input
					className="editModeInputField temporaryField"
					name="fieldOne"
					placeholder={type === "TEXT" ? "New title" : "New display text"}
					onChange={(event) => _checkTemporaryField(event, "first")}
					value={fieldOne}
				/>

				{type === "DEADLINE" ?
					<p style={{
						color: fieldTwoCorrect ? "transparent" : "#fff",
						textDecoration: "underline",
						marginBottom: "0.1rem"
					}}>Deadline is not formatted correctly</p>
					: null
				}
				<label className="temporaryLabel" htmlFor="fieldTwo">{type === "TEXT" ? "Text" : type === "LINK" ? "Link" : "Deadline (YYYY-MM-DD HH:mm)"}</label>
				<input
					className="editModeInputField temporaryField"
					name="fieldTwo" placeholder={type === "TEXT" ? "New text" : type === "LINK" ? "New link" : "YYYY-MM-DD HH:mm"}
					onChange={(event) => _checkTemporaryField(event, "second")}
					value={fieldTwo}
				/>
				<button onClick={_submitFields}>Submit content</button>
				<button onClick={onCancel}>Cancel</button>
			</div>
		</div>
	)
}

interface PropsForComponent {
	parentId: string,
	type: ContentType,
	onSubmitElement: (newElement: INewElement, isGroup?: boolean | undefined) => Promise<boolean>
	onCancel: () => void
}

export interface INewElement {
	parentId: string,
	fieldOne: string,
	fieldTwo: string,
	fieldTwoCorrect: boolean,
	fieldThree: string,
	type: ContentType
}