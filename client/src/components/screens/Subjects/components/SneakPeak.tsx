import React, { Component } from 'react'
import { AddedElement, ContentType } from '../../../../App'
import RenderData from '../../../templates/RenderData'
import { SubjectData } from '../Subjects'
import Http from "../../../../functions/HttpRequest"

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
						deleted={this.props.deleted}
						added={this.props.added}
						addDeleted={this.props.addDeleted}
						addContent={this.props.addContent}
					/>
				</div>
			</div>
		)
	}
}

export interface PropsForComponent {
	addContent: (id: string, fieldOne: string, fieldTwo: string, type: ContentType) => void
	addDeleted: (id: string) => void,
	showSneakPeak: (subject: SubjectData) => void,
	hideSneakPeak: () => void,
	updateSubjects: () => void,
	subject: SubjectData,
	editMode: boolean,
	deleted: string[],
	added: AddedElement[]
}