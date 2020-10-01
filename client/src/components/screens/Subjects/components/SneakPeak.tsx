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
	subject: SubjectData
}