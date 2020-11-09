import React, { Component } from 'react'
import Http from "functions/HttpRequest"
import { ILink } from "components/templates/RenderData"

export default class LinkObject extends Component<PropsForComponent, StateForComponent> {

	timer?: NodeJS.Timeout
	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			displayText: props.linkObject.displayText,
			link: props.linkObject.link
		}
	}

	componentWillUnmount() {
		if (this.timer)
			clearTimeout(this.timer)
	}

	_updateLink = async (event: React.ChangeEvent<HTMLInputElement>, type: "DisplayText" | "Link") => {
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

		if (this.timer)
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
			this.timer = undefined
		}, 1000)
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
		if (!!!this.props.editMode || this.props.id.toString().length === 0) {
			return (
				<div className="ButtonWrapper">
					<a href={this.state.link} className="Button">
						{this.state.displayText}
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
					<button onClick={this._delete}>Delete</button>
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
	updateSubjects: () => void,
	deleteContent: (id: string) => void
}

interface StateForComponent {
	displayText: string,
	link: string
}
