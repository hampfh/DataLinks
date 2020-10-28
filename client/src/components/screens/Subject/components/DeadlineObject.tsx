import React, { Component } from 'react'
import { calcDeadlinePercentage, calcTimeLeft } from '../../../../functions/date_calculations'
import "./Deadline.css"

export default class DeadlineObject extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props);

		this.state = {
			countdown: {
				months: 0,
				weeks: 0,
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0
			},
			bar: {
				max: 0,
				value: 0
			}
		}
	}

	componentDidMount() {
		let newState = { ...this.state }
		newState.countdown = calcTimeLeft(this.props.deadline)
		newState.bar = calcDeadlinePercentage(this.props.start, this.props.deadline)
		newState.interval = setInterval(() => {
			let newState = { ...this.state }
			newState.countdown = calcTimeLeft(this.props.deadline)
			newState.bar = calcDeadlinePercentage(this.props.start, this.props.deadline)
			this.setState(newState)
		}, 1000)
		this.setState(newState)
	}

	componentWillUnmount() {
		if (this.state.interval)
			clearInterval(this.state.interval)
	}

	render() {
		
		return (
			<div className="deadlineContainer">
				{this.props.displayText ? 
					<p className="deadlineTitleText">{this.props.displayText}</p>
				: null}
					<progress className="deadLineProgressBar" value={this.state.bar.value.toString()} max={this.state.bar.max.toString()} />
					{this.state.countdown.months === 0 &&
					this.state.countdown.weeks === 0 &&
					this.state.countdown.days === 0 &&
					this.state.countdown.hours === 0 &&
					this.state.countdown.minutes === 0 &&
					this.state.countdown.seconds === 0 ?
						<p className="countdownText">Deadline reached!</p> :
						<>
							<p className="countdownText">{`
								${this.state.countdown.months ? "Month(s): " + this.state.countdown.months : ""}
								${this.state.countdown.weeks ? " Week(s): " + this.state.countdown.weeks : ""}
								${this.state.countdown.days ? " Day(s): " + this.state.countdown.days : ""}
								`}
							</p>
							<p className="countdownText">{`${this.state.countdown.hours}:${this.state.countdown.minutes}:${this.state.countdown.seconds}`}</p>
						</>
					}
					
			</div>
		)
	}
}

interface PropsForComponent {
	displayText?: string,
	deadline: string,
	start: string,
}

interface StateForComponent {
	countdown: {
		months: number,
		weeks: number,
		days: number,
		hours: number,
		minutes: number,
		seconds: number
	}, 
	bar: {
		max: number,
		value: number
	},
	interval?: NodeJS.Timeout
}