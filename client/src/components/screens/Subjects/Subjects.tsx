import React, { Component } from 'react'
import SubjectComponent from "./components/Subject"
import { v4 as uuid } from "uuid"
import Http, { HttpReturnType } from "../../../functions/HttpRequest"
import "./Subjects.css"

export class Subjects extends Component<{}, StateForComponent> {

	constructor(props: {}) {
		super(props)

		this.state = {
			data: []
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
				subjects: Array<SubjectData>
			}
		}

		this.setState({ data: response.data.subjects })
	}

	render() {
		return (
			<section className="Master">
				<div>
					<h1 className="Title">Subjects</h1>
				</div>
				<div className="SubjectContainer">
					{
						this.state.data.map((subject) =>
							<SubjectComponent
								key={uuid()}
								subject={subject}
							/>
						)
					}
				</div>
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
	objects: Array<ContentObject>
}

export interface SubjectData {
	title: string,
	description: string,
	color: string,
	objects: Array<ContentObject | Group>
}

interface StateForComponent {
	data: Array<SubjectData>
}

export default Subjects
