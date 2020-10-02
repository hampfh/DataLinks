import React, { Component } from 'react'
import SubjectComponent from "./components/SubjectItem"
import "./Subjects.css"
import SubjectSneakPeak from "../Subjects/components/SneakPeak"
import { Group } from "../../templates/RenderData"

export class Subjects extends Component<PropsForComponent, StateForComponent> {

	interval?: NodeJS.Timeout
	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			elementsHidden: false,
			sneakPeak: undefined,
			selectScore: 0
		}
	}

	_showSneakPeak = (subject: SubjectData) => {
		if (this.interval != null)
			clearTimeout(this.interval);

		if (this.state.selectScore <= 0) {
			let newState = { ...this.state }
			newState.sneakPeak = subject
			newState.selectScore++;
			this.setState(newState)
		}
	}

	_hideSneakPeak = () => {
		let newState = { ...this.state }
		newState.selectScore--;
		this.setState(newState)

		this.interval = setTimeout(() => {
			if (this.state.selectScore <= 0) {
				let newState = { ...this.state }
				newState.sneakPeak = undefined
				this.setState(newState)
			}
		}, 10)
	}

	render() {
		return (
			<section className="Master">
				<div>
					<h1 className="Title">D20 links</h1>
				</div>
				<div>
					<button onClick={() => this.props.setEditMode(!!!this.props.editMode)}>{this.props.editMode ? "Default mode" : "Edit mode"}</button>
				</div>
				<div className="SubjectContainer">
					{
						this.props.subjects.map((subject) =>
							<SubjectComponent
								key={subject.code}
								subject={subject}
								elementsHidden={this.state.elementsHidden}
								showSneakPeak={this._showSneakPeak}
								hideSneakPeak={this._hideSneakPeak}
							/>
						)
					}
				</div>
				<div className="SneakPeakContainer">
					{this.state.sneakPeak == null ? null :
						<SubjectSneakPeak 
							editMode={this.props.editMode}
							subject={this.state.sneakPeak}
							showSneakPeak={this._showSneakPeak}
							hideSneakPeak={this._hideSneakPeak}
							updateSubjects={this.props.updateSubjects}
						/>
					}
				</div>
			</section>
		)
	}
}

export interface SubjectData {
	_id: string,
	name: string,
	code: string,
	description: string,
	color: string,
	group: Group
}

interface PropsForComponent {
	subjects: SubjectData[],
	editMode: boolean
	setEditMode: (mode: boolean) => void,
	updateSubjects: () => void
}

interface StateForComponent {
	elementsHidden: boolean,
	selectScore: number,
	sneakPeak?: SubjectData
}

export default Subjects
