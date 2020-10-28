import React, { Component } from 'react'
import RenderData from '../../../templates/RenderData'
import { SubjectData } from '../Subjects'

import "./SneakPeak.css"

export default class SneakPeak extends Component<PropsForComponent> {

	render() {
		if (this.props.subject.group == null) {
			console.warn("Subject " + this.props.subject.name + " has no root")
			return null;
		}

		return (
			<div 
				className="SneakPeakWrapper" 
				onMouseEnter={() => this.props.showSneakPeak(this.props.subject)}
				onMouseLeave={this.props.hideSneakPeak}
			>
				<div className="ContentContainer">
					<RenderData 
						updateSubjects={this.props.updateSubjects}
						editMode={this.props.editMode}
						group={this.props.subject.group}
					/>
				</div>
			</div>
		)
	}
}

export interface PropsForComponent {
	showSneakPeak: (subject: SubjectData) => void,
	hideSneakPeak: () => void,
	updateSubjects: () => void,
	subject: SubjectData,
	editMode: boolean,
}