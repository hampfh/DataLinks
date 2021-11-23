import React, { useState } from 'react'
import { connect } from "react-redux"
import Moment from "moment"

import DeadlineObject from 'components/templates/content_objects/DeadlineObject'
import "./ContentObject.css"
import { deleteLocally, editLocal, IDeleteLocally, IEditLocal } from "state/actions/local"
import { IReduxRootState } from "state/reducers"
import { ILocalState } from "state/reducers/local"
import { IAppState } from "state/reducers/app"
import { ContentType } from 'components/utilities/content_type'
import { remoteDeleteElement, remoteUpdateElement } from 'functions/contentRequests'
import LinkObject from 'components/templates/content_objects/LinkObject'
import TextObject from 'components/templates/content_objects/TextObject'
import useStatusCodeEvaluator from 'functions/hooks/useStatusCodeEvaluator'

function ContentObject(props: PropsForComponent) {

	const { actOnFailedRequest } = useStatusCodeEvaluator()

	const [prevFieldOne, setPrevFieldOne] = useState<string>((props.contentObject as IText).title ?? (props.contentObject as IDeadline).displayText ?? "")
	const [prevFieldTwo, setPrevFieldTwo] = useState<string>((props.contentObject as IText).text ?? (props.contentObject as IDeadline).deadline ?? (props.contentObject as ILink).link ?? "")
	const [, setPrevFieldThree] = useState<string>((props.contentObject as IDeadline).start ?? "")

	const [fieldOne, setFieldOne] = useState<string>((props.contentObject as IText).title ?? (props.contentObject as ILink).displayText ?? "")
	const [fieldTwo, setFieldTwo] = useState<string>((props.contentObject as IText).text ?? (props.contentObject as IDeadline).deadline ?? (props.contentObject as ILink).link ?? "")
	const [fieldThree, setFieldThree] = useState<string>((props.contentObject as IDeadline).start ?? "")
	const [fieldTwoValid, setFieldTwoValid] = useState(true)

	function _updateField(event: React.ChangeEvent<HTMLInputElement>, fieldNum: "first" | "second" | "third") {

		if (props.type === ContentType.DEADLINE && fieldNum === "second" && !!!Moment(event.target.value).isValid()) {
			setFieldTwoValid(false)
		} else {
			setFieldTwoValid(true)
		}

		if (fieldNum === "first")
			setFieldOne(event.target.value)
		else if (fieldNum === "second")
			setFieldTwo(event.target.value)
		else
			setFieldThree(event.target.value)
	}


	async function _updateContent() {

		if (!fieldTwoValid)
			return

		setPrevFieldOne(fieldOne)
		setPrevFieldTwo(fieldTwo)
		setPrevFieldThree(fieldThree)

		actOnFailedRequest(await remoteUpdateElement(props.parentId, props.id, props.type, fieldOne, fieldTwo))
	}

	if (props.updateSubjects === undefined && (props.noEditMode === undefined || !!!props.noEditMode)) {
		if (process.env.NODE_ENV === "development")
			throw new Error("Must specify either updateSubjects or noEditMode")
		else
			return null;
	}

	return (
		<>
			{
				props.type === ContentType.TEXT ?
					<TextObject id={props.id} title={fieldOne} text={fieldTwo} editMode={props.app.flags.editMode} updateElement={_updateField} /> :
				props.type === ContentType.LINK ?
					<LinkObject id={props.id} displayText={fieldOne} link={fieldTwo} editMode={props.app.flags.editMode} updateElement={_updateField} /> :
					<DeadlineObject 
						id={props.childId ?? props.id} 
						displayText={fieldOne} 
						deadline={fieldTwo} 
						start={fieldThree} 
						accent={props.accent} 
						fieldTwoValid={fieldTwoValid}
						updateElement={_updateField}
						noEditMode={props.noEditMode ?? false}
					/>
			}
			{props.app.flags.editMode && !props.noEditMode ?
				<div className="buttonContainerEditMode">
					{props.id.toString().length !== 0 && (
						prevFieldOne !== fieldOne ||
						prevFieldTwo !== fieldTwo
					) ?
						<button onClick={_updateContent}>Update fields</button>
						: null
					}
					{props.id.toString().length === 0 ? null :
						<button onClick={async () => actOnFailedRequest(await remoteDeleteElement(props.parentId, props.id))}>Delete</button>
					}
				</div> : null
			}	
		</>
	)
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

const reduxSelect = (state: IReduxRootState) => ({
	app: state.app,
	local: state.local
})

const reduxDispatch = () => ({
	deleteLocally,
	editLocal
})

export default connect(reduxSelect, reduxDispatch())(ContentObject);