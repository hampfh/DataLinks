import React, { Component } from 'react'
import "./SubjectItem.css"
import "./Animation.css"
import { SubjectData } from '../Subjects'
import { Redirect } from "react-router-dom"

import GROUP_ICON from "assets/icons/interfacePack/svg/group.svg"
import CALCULATOR_ICON from "assets/icons/interfacePack/svg/calculator.svg"
import DOCUMENT_ICON from "assets/icons/interfacePack/svg/document-3.svg"
import COMPUTER_ICON from "assets/icons/interfacePack/svg/computer.svg"
import { IReduxRootState } from "state/reducers"
import { connect } from "react-redux"
import { IAppState } from "state/reducers/app"
import { 
	hideSneakPeak, 
	IHideSneakPeak, 
	ISetSneakPeakSelectionCount, 
	IShowSneakPeak, 
	setSneakPeakSelectionCount, 
	showSneakPeak 
} from "state/actions/app"

export class Subject extends Component<PropsForComponent, StateForComponent> {

	collapseStateTimeout?: NodeJS.Timeout
	mouseLeaveLock?: NodeJS.Timeout
	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			collapsState: 0,
			timeoutDone: false
		}
	}

	shouldComponentUpdate(newProps: PropsForComponent, newState: StateForComponent) {
		if (newProps.app.sneakPeak?._id.toString() === this.props.app.sneakPeak?._id.toString() && 
		newState.collapsState === this.state.collapsState)
			return false

		return true;
	}

	componentWillUnmount() {
		if (this.collapseStateTimeout)
			clearTimeout(this.collapseStateTimeout)
		if (this.mouseLeaveLock)
			clearTimeout(this.mouseLeaveLock)
	}

	_onClick = () => {
		// Extend the subject container
		if (this.state.collapsState === 0) {
			const newState = { ...this.state }
			newState.collapsState = 2
			this.setState(newState)

			this.collapseStateTimeout = setTimeout(() => {
				const newState = { ...this.state }
				newState.collapsState = 3
				this.setState(newState)
			}, 100)
			this.props.hideSneakPeak()
		}
	}

	_mouseEnter = () => {

		// We don't need to set it again
		if (this.props.subject._id.toString() === this.props.app.sneakPeak?._id.toString()) {
			this.props.showSneakPeak(this.props.subject)
			return
		}

		let newState = { ...this.state }
		newState.timeoutDone = false;
		this.setState(newState)

		this.props.showSneakPeak(this.props.subject)
	}

	_mouseLeave = () => {
		if (this.props.subject._id.toString() === this.props.app.sneakPeak?._id.toString()) {
			this.mouseLeaveLock = setTimeout(() => {
				// Lower selection score
				this.props.setSneakPeakSelectionCount(this.props.app.sneakPeakSelectionCount - 1)
			}, 10)
		}
	}

	getSubjectIcon(subject: string): string {
		switch(subject) {
			case "DD1390":
				return GROUP_ICON
			case "SF1671":
			case "SF1624":
			case "SF1625":
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
			<div className="SubjectItemWrapper">
				{this.state.collapsState !== 3 ? 
					<div className="Subject" 
						onClick={this._onClick} 
						onMouseLeave={this._mouseLeave}
					>
						<img alt="Subject icon" 
							onMouseEnter={this._mouseEnter}
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
			</div>
		)
	}
}

export interface StateForComponent {
	collapsState: number,
	timeoutDone: boolean
}

export interface PropsForComponent {
	app: IAppState,
	subject: SubjectData,
	showSneakPeak: IShowSneakPeak,
	hideSneakPeak: IHideSneakPeak,
	setSneakPeakSelectionCount: ISetSneakPeakSelectionCount,
	updateSubjects: () => void,
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		app: state.app
	}
}

const reduxDispatch = () => {
	return {
		setSneakPeakSelectionCount,
		showSneakPeak,
		hideSneakPeak
	}
}
export default connect(reduxSelect, reduxDispatch())(Subject)
