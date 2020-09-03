import React, { Component } from 'react'
import "./SubjectItem.css"
import "./Animation.css"
import { SubjectData, ContentObject } from '../Subjects'
import { v4 as uuid } from "uuid"
import SubjectView from "./SubjectView"

export class Subject extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			collapsState: 0,
			subject: props.subject
		}
	}

	_onClick = () => {
		// Extend the subject container
		if (this.state.collapsState === 0) {
			this.props.hideAll()
			const newState = { ...this.state }
			newState.collapsState = 2
			this.setState(newState)

			setTimeout(() => {
				const newState = { ...this.state }
				newState.collapsState = 3
				this.setState(newState)
			}, 200)
		}
	}

	resetCollapse = () => {
		this.props.showAll()
		const newState = { ...this.state }
		newState.collapsState = 0
		this.setState(newState)
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
		if (this.state.subject === undefined)
			return null
		return (
			<>
				{(this.state.collapsState !== 3 && !!!this.props.elementsHidden) || this.state.collapsState === 2 ? 
					<div className={`Subject`} onClick={this._onClick}>
						<img className={`${this.state.collapsState === 0 ? "collapsed" : this.state.collapsState === 2 ? "expanding" : ""}`} src={this.getSubjectIcon(this.props.subject.title)} />
						<h4 className="Header">{this.state.subject.title}</h4>
					</div>
					: null
				}
				{this.state.collapsState >= 2 ? 
					<SubjectView subject={this.props.subject} close={this.resetCollapse} />
					: null
				}
			</>
		)
	}
}

export interface StateForComponent {
	collapsState: number,
	subject: SubjectData | undefined
}

export interface PropsForComponent {
	subject: SubjectData,
	elementsHidden: boolean,
	showAll: () => void,
	hideAll: () => void
}

export default Subject
