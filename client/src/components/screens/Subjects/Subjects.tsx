import React, { Component } from 'react'
import SubjectComponent from "./components/SubjectItem"
import "./Subjects.css"
import { StateForComponent as PropsForComponent } from "../../../App"

export class Subjects extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			elementsHidden: false
		}
	}

	render() {
		return (
			<section className="Master">
				<div>
					<h1 className="Title">{this.props.data.title}</h1>
				</div>
				<div className="SubjectContainer">
					{
						this.props.data.subjects.map((subject) =>
							<SubjectComponent
								key={subject.title}
								subject={subject}
								elementsHidden={this.state.elementsHidden}
							/>
						)
					}
				</div>
				<div className="CreditsWrapper">
					<p className={"Credits"}>Site by <b>Hampus H</b></p>
					<p className={"Credits"}>Icons made by <a href="https://www.flaticon.com/authors/chanut" title="Chanut">Chanut</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></p>
					<p className={"Credits"}>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></p>
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
	elementsHidden: boolean
}

export default Subjects
