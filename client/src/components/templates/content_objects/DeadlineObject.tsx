import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { calcDeadlinePercentage, calcTimeLeft, formatNumberToClock } from "functions/date_calculations"
import "./Deadline.css"
import { 
	addCompleteDeadline, 
	IAddCompleteDeadline, 
	IRemoveCompleteDeadline, 
	IResetAnimatedDeadline, 
	removeCompleteDeadline, 
	resetAnimatedDeadline 
} from "state/actions/deadlines"
import { IReduxRootState } from "state/reducers"
import { IDeadlineState } from "state/reducers/deadlines"
import Checkmark from 'components/screens/Subject/components/Checkmark'

class DeadlineObject extends PureComponent<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props);

		const hash = this.props.id.toString()

		this.state = {
			hash: hash,
			complete: this.props.deadlines.completed.find((currentHash) => currentHash === hash) != null,
			countdown: {
				months: 0,
				weeks: 0,
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0
			},
			bar: { // Progress bar values
				max: 0,
				value: 0
			},
			mounted: false,	// Mounted is used to determine if it's ok to start updating the clock every second
			interval: setInterval(() => { // Timer
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
		if (this.state.interval)
			clearInterval(this.state.interval)
	}

	isEmptyFirstRow() {
		return !!!this.state.countdown.months && !!!this.state.countdown.weeks && !!!this.state.countdown.days
	}

	_toggleDone = (complete: boolean) => {

		// It is not possible to change completeness in edit mode
		if (this.props.editMode)
			return

		if (!!!complete) {
			this.props.resetAnimatedDeadline(this.state.hash)
			this.props.removeCompleteDeadline(this.state.hash)
		}
		else
			this.props.addCompleteDeadline(this.state.hash)
		let newState = { ...this.state }
		newState.complete = !!!newState.complete
		this.setState(newState)
	}

	render() {
		
		const deadlineReached = this.state.countdown.months === 0 &&
			this.state.countdown.weeks === 0 &&
			this.state.countdown.days === 0 &&
			this.state.countdown.hours === 0 &&
			this.state.countdown.minutes === 0 &&
			this.state.countdown.seconds === 0

		return (
			<>
				{this.props.editMode ? 
					// Edit mode
					<div className="ButtonWrapper ButtonWrapperEditMode">
						<div className="editModeField">
							<label htmlFor="fieldOne" className="editLabel">Deadline description</label>
							<input
								className="editModeInputField"
								disabled={this.props.id.toString().length === 0}
								name="fieldOne"
								value={this.props.displayText}
								onChange={(event) => this.props.updateElement(event, "first")}
							/>
						</div>
						<div className="editModeField">
							<p style={{
								color: this.props.fieldTwoValid ? "transparent" : "#fff",
								textDecoration: "underline",
								marginTop: "0",
								marginBottom: "0.1rem"
							}}>Deadline is not formatted correctly</p>
							<label htmlFor="fieldTwo" className="editLabel">Deadline (YYYY-MM-DD HH:mm)</label>
							<input
								className="editModeInputField"
								disabled={this.props.id.toString().length === 0}
								name="fieldTwo"
								value={this.props.deadline}
								onChange={(event) => this.props.updateElement(event, "second")}
								placeholder={"YYYY-MM-DD HH:mm"}
							/>
						</div>
					</div> :
					// Non-edit mode 
					<div className="deadlineContainer">
						{this.props.displayText ?
							<p className={`deadlineTitleText ${this.props.accent ? "accent" : ""}`}>{this.props.displayText}</p>
							: null}
						<div className={`deadlineProgressBarContainer ${!!!this.props.editMode ? "clickable" : ""}`}>
							<progress
								className={`deadLineProgressBar ${this.state.complete ? "complete" : ""}`}
								value={deadlineReached || this.state.complete ? 1 : this.state.bar.value.toString()}
								max={deadlineReached || this.state.complete ? 1 : this.state.bar.max.toString()}
								onClick={() => this._toggleDone(!!!this.state.complete)}
							/>
							{this.state.complete ?
								<Checkmark hash={this.state.hash} unCompleteThisDeadline={() => this._toggleDone(false)} /> : null}
						</div>
						{deadlineReached || this.state.complete ?
							<>
								<p className={`countdownText ${this.props.accent ? "accent" : ""}`}>{this.state.complete ? "Task done!" : "Deadline reached!"}</p>
								<p className="countdownText transparent">-</p>
							</> :
							<>
								{this.isEmptyFirstRow() ? null : <p className={`countdownText ${this.props.accent ? "accent" : ""}`}>{`
								${this.state.countdown.months ? this.state.countdown.months + " Month(s)" : ""}
								${this.state.countdown.weeks ? this.state.countdown.weeks + " Week(s) " : ""}
								${this.state.countdown.days ? this.state.countdown.days + " Day(s) " : ""}
								`}
								</p>}

								<p className={`countdownText ${this.props.accent ? "accent" : ""}`}>{`${formatNumberToClock(this.state.countdown.hours)} : ${formatNumberToClock(this.state.countdown.minutes)} : ${formatNumberToClock(this.state.countdown.seconds)}`}</p>
								{this.isEmptyFirstRow() ?
									<p className="countdownText transparent">-</p> :
									null
								}
							</>
						}
					</div>
				}
			</>
		)
	}
}

interface PropsForComponent {
	id: string,
	displayText?: string,
	deadline: string,
	start: string,
	accent?: boolean,
	deadlines: IDeadlineState,
	editMode: boolean,
	fieldTwoValid: boolean,
	addCompleteDeadline: IAddCompleteDeadline,
	removeCompleteDeadline: IRemoveCompleteDeadline,
	resetAnimatedDeadline: IResetAnimatedDeadline,
	updateElement: (event: React.ChangeEvent<HTMLInputElement>, fieldNum: "first" | "second" | "third") => void
}

interface StateForComponent {
	hash: string,
	complete: boolean,
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

const reduxSelect = (state: IReduxRootState) => ({
	deadlines: state.deadlines,
	editMode: state.app.flags.editMode
})

const reduxDispatch = () => ({
	addCompleteDeadline,
	removeCompleteDeadline,
	resetAnimatedDeadline
})

export default connect(reduxSelect, reduxDispatch())(DeadlineObject)