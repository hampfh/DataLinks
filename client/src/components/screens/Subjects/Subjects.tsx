import React, { Component } from 'react'
import SubjectComponent from "./components/SubjectItem"
import { v4 as uuid } from "uuid"
import Http, { HttpReturnType } from "../../../functions/HttpRequest"
import "./Subjects.css"

export class Subjects extends Component<{}, StateForComponent> {

	constructor(props: {}) {
		super(props)

		this.state = {
			data: {
				title: "",
				subjects: []
			},
			elementsHidden: false
		}
	}

	async componentDidMount() {
		const response = (await Http({
			url: "/data",
			method: "GET",
			body: {

			}
		})) as HttpReturnType & {
			data: {
				title: string,
				subjects: Array<SubjectData>
			}
		}

		const newState = { ...this.state }
		newState.data = response.data
		this.setState(newState)
	}

	hideAll = () => {
		const newState = { ...this.state }
		newState.elementsHidden = true
		this.setState(newState)
	}

	showAll = () => {
		const newState = { ...this.state }
		newState.elementsHidden = false
		this.setState(newState)
	}

	render() {
		return (
			<section className="Master">
				<div>
					<h1 className="Title">{this.state.data.title}</h1>
				</div>
				<div className="SubjectContainer">
					{
						this.state.data.subjects.map((subject) =>
							<SubjectComponent
								key={subject.title}
								subject={subject}
								elementsHidden={this.state.elementsHidden}
								hideAll={this.hideAll}
								showAll={this.showAll}
							/>
						)
					}
				</div>
				Icons made by <a href="https://www.flaticon.com/authors/chanut" title="Chanut">Chanut</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
				Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
			</section>
		)
	}
}

export interface ContentObject {
	displayName: string,
	link?: string,
	text?: string,
	color: string
}

export interface Group {
	group: string,
	objects: Array<ContentObject>,
	column?: boolean,
	split?: boolean
}

export interface SubjectData {
	title: string,
	description: string,
	color: string,
	objects: Array<ContentObject | Group>
}

interface StateForComponent {
	data: {
		title: string,
		subjects: Array<SubjectData>
	},
	elementsHidden: boolean
}

export default Subjects
