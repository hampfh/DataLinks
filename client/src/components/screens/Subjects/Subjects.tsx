import React, { Component } from 'react'
import SubjectComponent from "./components/SubjectItem"
import "./Subjects.css"
import { StateForComponent as PropsForComponent } from "../../../App"
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
							subject={this.state.sneakPeak}
							showSneakPeak={this._showSneakPeak}
							hideSneakPeak={this._hideSneakPeak}
						/>
					}
				</div>
			</section>
		)
	}
}

export interface SubjectData {
	name: string,
	code: string,
	description: string,
	color: string,
	group: Group
}

interface StateForComponent {
	elementsHidden: boolean,
	selectScore: number,
	sneakPeak?: SubjectData
}

export default Subjects
