import React, { Component } from 'react'
import "./Checkmark.css"
import { connect } from 'react-redux'
import { IReduxRootState } from '../../../../state/reducers'
import { IDeadlineState } from '../../../../state/reducers/deadlines'
import { hasAnimatedDeadline, IHasAnimatedDeadline, IResetAnimatedDeadline, resetAnimatedDeadline } from '../../../../state/actions/deadlines'

class Checkmark extends Component<PropsForComponent, StateForComponent> {

	timeout?: NodeJS.Timeout
	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			hasAnimated: this.props.deadlines.hasAnimated.find((hash) => hash === this.props.hash) != null
		}
	}

	componentDidMount() {
		if (this.props.deadlines.hasAnimated.find((target) => target === this.props.hash) == null)
			this.props.hasAnimatedDeadline(this.props.hash)
	}

	componentWillUnmount() {
		if (this.timeout)
			clearTimeout(this.timeout)
	}

	render() {
		return (
			<div 
				onClick={this.props.unCompleteThisDeadline}
				className="centerCheckmarkAligner"
			>
				<svg 
					onClick={this.props.unCompleteThisDeadline}
					className={`checkmark ${this.state.hasAnimated ? "" : "animate"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"
				>
					<circle className={`checkmark__circle ${this.state.hasAnimated ? "" : "animate"}`} cx="26" cy="26" r="25" fill="none" />
					<path className={`checkmark__check ${this.state.hasAnimated ? "" : "animate"}`} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
				</svg>
			</div>
		)
	}
}

interface PropsForComponent {
	hash: string,
	deadlines: IDeadlineState,
	unCompleteThisDeadline: () => void,
	hasAnimatedDeadline: IHasAnimatedDeadline,
	resetAnimatedDeadline: IResetAnimatedDeadline
}

interface StateForComponent {
	hasAnimated: boolean
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		deadlines: state.deadlines
	}
}

const reduxDispatch = () => {
	return {
		hasAnimatedDeadline,
		resetAnimatedDeadline
	}
}

export default connect(reduxSelect, reduxDispatch())(Checkmark)