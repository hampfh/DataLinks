import React, { Component } from 'react'
import RenderData from '../../../templates/RenderData'
import { SubjectData } from '../Subjects'

import "./SneakPeak.css"

export default class SneakPeak extends Component<PropsForComponent> {
	render() {
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
						deleted={this.props.deleted}
						addDeleted={this.props.addDeleted}
					/>
				</div>
			</div>
		)
	}
}

export interface PropsForComponent {
	addDeleted: (id: string) => void,
	showSneakPeak: (subject: SubjectData) => void,
	hideSneakPeak: () => void,
	updateSubjects: () => void,
	subject: SubjectData,
	editMode: boolean,
	deleted: string[]
}