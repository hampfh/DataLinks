import React, { Component } from 'react'
import "./SubjectItem.css"
import "./Animation.css"
import { SubjectData } from '../Subjects'
import { Redirect } from 'react-router-dom'

import GROUP_ICON from "../../../../assets/icons/interfacePack/svg/group.svg"
import CALCULATOR_ICON from "../../../../assets/icons/interfacePack/svg/calculator.svg"
import DOCUMENT_ICON from "../../../../assets/icons/interfacePack/svg/document-3.svg"
import COMPUTER_ICON from "../../../../assets/icons/interfacePack/svg/computer.svg"

export class Subject extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			collapsState: 0
		}
	}

	_onClick = () => {
		// Extend the subject container
		if (this.state.collapsState === 0) {
			const newState = { ...this.state }
			newState.collapsState = 2
			this.setState(newState)

			setTimeout(() => {
				const newState = { ...this.state }
				newState.collapsState = 3
				this.setState(newState)
			}, 100)
		}
	}

	getSubjectIcon(subject: string): string {
		switch(subject) {
			case "DD1390":
				return GROUP_ICON
			case "SF1671":
			case "SF1624":
				return CALCULATOR_ICON
			case "DA1600":
				return DOCUMENT_ICON
			case "DD1337":
			case "DD1338":
				return COMPUTER_ICON
		}
		return ""
	}

	render() {
		return (
			<>
				{(this.state.collapsState !== 3 && !!!this.props.elementsHidden) || this.state.collapsState === 2 ? 
					<div className={`Subject`} 
						onClick={this._onClick} 
						onMouseLeave={this.props.hideSneakPeak}
					>
						<img alt="Subject icon" 
							onMouseEnter={() => this.props.showSneakPeak(this.props.subject)}
							className={`${this.state.collapsState === 0 ? "collapsed" : this.state.collapsState === 2 ? "expanding" : ""}`} 
							src={this.getSubjectIcon(this.props.subject.code)} 
						/>
						<h4 className="Header">{this.props.subject.code}</h4>
					</div>
					: null
				}
				{this.state.collapsState === 3 ? 
					<Redirect to={`/D20/course/${this.props.subject.code}`} /> : null
				}
			</>
		)
	}
}

export interface StateForComponent {
	collapsState: number
}

export interface PropsForComponent {
	subject: SubjectData,
	elementsHidden: boolean,
	showSneakPeak: (subject: SubjectData) => void,
	hideSneakPeak: () => void
}

export default Subject
