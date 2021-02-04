import React, { Component } from 'react'
import "./SubjectItem.css"
import "./Animation.css"
import { SubjectData } from '../Subjects'
import { Redirect } from "react-router-dom"

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
import { getSubjectIcon } from 'components/utilities/logos'

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
							src={getSubjectIcon(this.props.subject.logo)} 
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
