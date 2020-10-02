import React, { Component } from 'react'
import Http from '../../../../functions/HttpRequest'
import { ILink } from '../../../templates/RenderData'

export default class LinkObject extends Component<PropsForComponent, StateForComponent> {

	timer?: NodeJS.Timeout
	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			displayText: props.linkObject.displayText,
			link: props.linkObject.link
		}
	}

	_updateLink = async (event: React.ChangeEvent<HTMLInputElement>, type: "DisplayText" | "Link") => {
		console.log(event.target.value)
		let newState = { ...this.state }
		if (type === "DisplayText") {
			newState.displayText = event.target.value
		} else {
			newState.link = event.target.value
		}

		this.setState(newState)

		let append: {
			parentGroup: string,
			id: string,
			displayText?: string | null,
			link?: string | null
		} = {
			parentGroup: this.props.parentId.toString(),
			id: this.props.id,
		}

		if (type === "DisplayText")
			append.displayText = event.target.value.length <= 0 ? "-" : event.target.value
		else
			append.link = event.target.value.length <= 0 ? "-" : event.target.value

		if (this.timer !== undefined)
			clearTimeout(this.timer)
			this.timer = setTimeout(async () => {
			const response = await Http({
				url: "/api/v1/group/linkcontent",
				method: "PATCH",
				data: append
			})
			if (response.status !== 200) {
				if (window.confirm("The site encountered an error, reload the site?"))
					window.location.reload()
			}
			this.props.updateSubjects()
			console.log("Updated")
			this.timer = undefined
		}, 1000)
	}

	render() {
		if (!!!this.props.editMode) {
			return (
				<div className="ButtonWrapper">
					<a href={this.state.displayText} className="Button">
						{this.state.link}
					</a>
				</div>
			)
		} else {
			return (
				<div className="ButtonWrapper">
					<label htmlFor="displayText">Display text</label>
					<input
						name="displayText" value={this.state.displayText ?? ""}
						onChange={(event) => this._updateLink(event, "DisplayText")}
					/>
					<label htmlFor="link">Link</label>
					<input 
						name="link" value={this.state.link} 
						onChange={(event) => this._updateLink(event, "Link")}
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
	linkObject: ILink,
	updateSubjects: () => void
}

interface StateForComponent {
	displayText: string,
	link: string
}
