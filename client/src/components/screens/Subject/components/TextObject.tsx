import React, { Component } from 'react'
import Http from '../../../../functions/HttpRequest'
import { ILink, IText } from '../../../templates/RenderData'

export default class TextObject extends Component<PropsForComponent, StateForComponent> {

	timer?: NodeJS.Timeout
	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			title: props.textObject.title,
			text: props.textObject.text
		}
	}

	_updateText = async (event: React.ChangeEvent<HTMLInputElement>, type: "Title" | "Text") => {
		console.log(event.target.value)
		let newState = { ...this.state }
		if (type === "Title") {
			newState.title = event.target.value
		} else {
			newState.text = event.target.value
		}

		this.setState(newState)

		let append: {
			parentGroup: string,
			id: string,
			title?: string,
			text?: string
		} = {
			parentGroup: this.props.parentId.toString(),
			id: this.props.id,
		}

		if (type === "Title")
			append.title = event.target.value.length <= 0 ? "-" : event.target.value
		else
			append.text = event.target.value.length <= 0 ? "-" : event.target.value

		if (this.timer !== undefined)
			clearTimeout(this.timer)
		this.timer = setTimeout(async () => {
			const response = await Http({
				url: "/api/v1/group/textcontent",
				method: "PATCH",
				data: append
			})
			if (response.status !== 200) {
				if (window.confirm("The site encountered an error, reload the site?"))
					window.location.reload()
			}

			console.log("Updated")
			this.timer = undefined
		}, 1000)
	}

	render() {
		if (!!!this.props.editMode) {
			return (
				<div className="textObjectContainer">
					{this.props.textObject.title === undefined ? null :
						<h5 className="textObjectTitle">{this.props.textObject.title}</h5>
					}
					{this.props.textObject.text === undefined ? null :
						<p className="textObject">{this.props.textObject.text}</p>
					}
				</div>
			)
		} else {
			return (
				<div className="ButtonWrapper">
					<label htmlFor="title">Title</label>
					<input
						name="title" value={this.state.title ?? ""}
						onChange={(event) => this._updateText(event, "Title")}
					/>
					<label htmlFor="text">Text</label>
					<input
						name="text" value={this.state.text ?? ""}
						onChange={(event) => this._updateText(event, "Text")}
					/>
				</div>
			)
		}
	}
}

interface PropsForComponent {
	parentId: string,
	id: string,
	editMode: boolean,
	textObject: IText
}

interface StateForComponent {
	title: string,
	text: string
}
