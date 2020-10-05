import React, { Component } from 'react'
import "./SubjectItem.css"
import "./Animation.css"
import { SubjectData } from '../Subjects'
import { Redirect } from 'react-router-dom'

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
				return require("../../../../assets/icons/interfacePack/svg/group.svg")
			case "SF1671":
				return require("../../../../assets/icons/interfacePack/svg/calculator.svg")
			case "DA1600":
				return require("../../../../assets/icons/interfacePack/svg/document-3.svg")
			case "DD1337":
				return require("../../../../assets/icons/interfacePack/svg/computer.svg")
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
					<Redirect to={`/D20/course/${this.props.subject.name}`} /> : null
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
