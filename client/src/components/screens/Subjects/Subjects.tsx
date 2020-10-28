import React, { Component } from 'react'
import SubjectComponent from "./components/SubjectItem"
import "./Subjects.css"
import "./components/Switch.css"
import SubjectSneakPeak from "../Subjects/components/SneakPeak"
import { Group } from "../../templates/RenderData"
import { AddedElement, ContentType } from '../../../App'
import isMobile from "../../../functions/isMobile"

export class Subjects extends Component<PropsForComponent, StateForComponent> {

	interval?: NodeJS.Timeout
	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			elementsHidden: false,
			sneakPeak: undefined,
			selectScore: 0 // Select score is used since multiple elements may be used for sneakPeakView
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
				{isMobile() ? null :
					<div className="editModeContainer">
						<p>Default mode</p>
						<label className="switch">
							<input onChange={(event) => this.props.setEditMode(event.target.checked)} checked={this.props.editMode} type="checkbox" />
							<span className="slider round"></span>
						</label>
						<p>Edit mode</p>
					</div>
				}
				<div className="SubjectContainer">
					{
						this.props.subjects.map((subject) => {
							if (subject.group == null) 
								return null
							else {
								return <SubjectComponent
									key={subject.code}
									subject={subject}
									elementsHidden={this.state.elementsHidden}
									showSneakPeak={this._showSneakPeak}
									hideSneakPeak={this._hideSneakPeak}
								/>
							}
						})
					}
				</div>
				<div className="SneakPeakContainer">
					{this.state.sneakPeak == null || window.innerWidth < 750 || isMobile() ? null :
						<SubjectSneakPeak 
							editMode={this.props.editMode}
							subject={this.state.sneakPeak}
							showSneakPeak={this._showSneakPeak}
							hideSneakPeak={this._hideSneakPeak}
							updateSubjects={this.props.updateSubjects}
							deleted={this.props.deleted}
							added={this.props.added}
							addDeleted={this.props.addDeleted}
							addContent={this.props.addContent}
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
	updateSubjects: () => void,
	deleted: string[],
	added: AddedElement[],
	addDeleted: (id: string) => void,
	addContent: (id: string, fieldOne: string, fieldTwo: string, type: ContentType) => void
}

interface StateForComponent {
	elementsHidden: boolean,
	selectScore: number,
	sneakPeak?: SubjectData
}

export default Subjects
