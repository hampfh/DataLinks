import React, { PureComponent } from 'react'
import { calcDeadlinePercentage, calcTimeLeft } from '../../../../functions/date_calculations'
import "./Deadline.css"

export default class DeadlineObject extends PureComponent<PropsForComponent, StateForComponent> {

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
			},
			mounted: false,
			interval: setInterval(() => {
				if (this.state.mounted) {
					let newState = { ...this.state }
					newState.countdown = calcTimeLeft(this.props.deadline)
					newState.bar = calcDeadlinePercentage(this.props.start, this.props.deadline)
					this.setState(newState)
				}
			}, 1000)
		}
	}

	componentDidMount() {
		let newState = { ...this.state }
		newState.countdown = calcTimeLeft(this.props.deadline)
		newState.bar = calcDeadlinePercentage(this.props.start, this.props.deadline)
		newState.mounted = true
		this.setState(newState)
	}

	componentWillUnmount() {
		clearInterval(this.state.interval as NodeJS.Timeout)
	}

	render() {
		
		const deadlineReached = this.state.countdown.months === 0 &&
			this.state.countdown.weeks === 0 &&
			this.state.countdown.days === 0 &&
			this.state.countdown.hours === 0 &&
			this.state.countdown.minutes === 0 &&
			this.state.countdown.seconds === 0

		return (
			<div className="deadlineContainer">
				{this.props.displayText ? 
					<p className={`deadlineTitleText ${this.props.accent ? "accent" : ""}`}>{this.props.displayText}</p>
				: null}
					<progress className="deadLineProgressBar" value={deadlineReached ? 1 : this.state.bar.value.toString()} max={deadlineReached ? 1 : this.state.bar.max.toString()} />
					{deadlineReached ?
						<p className={`countdownText ${this.props.accent ? "accent" : ""}`}>Deadline reached!</p> :
						<>
							<p className={`countdownText ${this.props.accent ? "accent" : ""}`}>{`
								${this.state.countdown.months ? this.state.countdown.months + " Month(s)" : ""}
								${this.state.countdown.weeks ? this.state.countdown.weeks + " Week(s) " : ""}
								${this.state.countdown.days ? this.state.countdown.days + " Day(s) " : ""}
								`}
							</p>
							
							<p className={`countdownText ${this.props.accent ? "accent" : ""}`}>{`${this.state.countdown.hours}:${this.state.countdown.minutes}:${this.state.countdown.seconds}`}</p>
							{ // Add dummy text to align deadlines correctly if one line is empty
							!!!this.state.countdown.months && !!!this.state.countdown.weeks && !!!this.state.countdown.days ?
								<p className="countdownText transparent">---</p> :
								null
							}
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
	accent?: boolean
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
	interval?: NodeJS.Timeout,
	mounted: boolean
}