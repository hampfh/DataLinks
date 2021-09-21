import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { calcDeadlinePercentage, calcTimeLeft, formatNumberToClock } from "functions/date_calculations"
import "./Deadline.css"
import { 
	addCompleteDeadline, 
	IAddCompleteDeadline, 
	IRemoveCompleteDeadline, 
	removeCompleteDeadline,
	saveCompletedDeadlines,
} from "state/actions/deadlines"
import { IReduxRootState } from "state/reducers"
import { IDeadlineState } from "state/reducers/deadlines"
import { ISetReplaceCountdownWithDateFlag, setReplaceCountdownWithDateFlag } from 'state/actions/app'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { appendsIfPlural } from 'functions/string_formatting'
import Checkmark from 'components/screens/Subject/components/Checkmark'

class DeadlineObject extends PureComponent<PropsForComponent, StateForComponent> {

	animationTimeout?: NodeJS.Timeout
	constructor(props: PropsForComponent) {
		super(props);

		const hash = this.props.id.toString()

		this.state = {
			hash: hash,
			animatedFlip: 0,
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
		
		if (this.animationTimeout)
			clearTimeout(this.animationTimeout)
		this.animationTimeout = setTimeout(() => {
			const newState = { ...this.state }
			newState.animatedFlip = 0
			this.setState(newState)
		})
	}

	componentWillUnmount() {
		if (this.state.interval)
			clearInterval(this.state.interval)
		if (this.animationTimeout)
			clearTimeout(this.animationTimeout)
	}

	firstRowIsEmpty() {
		return !!!this.state.countdown.months && !!!this.state.countdown.weeks && !!!this.state.countdown.days
	}

	_clickCard = () => {
		
		const newState = { ...this.state }
		newState.animatedFlip = 1
		this.setState(newState)

		// Wait for first rotation
		this.animationTimeout = setTimeout(() => {

			const newState = { ...this.state }
			newState.animatedFlip = 0
			newState.complete = !newState.complete
			this.setState(newState)
		}, 250)
	}
	
	_toggleDeadlineContent = () => {
		this.props.setReplaceCountdownWithDateFlag(!this.props.replaceCountdownWithDate)
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
				{this.props.editMode && !!!this.props.noEditMode ? 
					// Edit mode
					<div className="default-nested-box-container editmode">
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
					<div 
						title={`${this.state.complete ? "Mark uncompleted" : "Mark completed"}`}
						onClick={this._clickCard}
						className={`default-nested-box-container deadline-container ${this.state.animatedFlip === 1 ? "animated" : ""}`}
					>
						{this.props.displayText &&
							<p className="deadline-title-text">{this.props.displayText}</p>
						}
						{this.state.complete ? 
							<div className="deadline-content-container completed">
								<Checkmark deadlineId={this.state.hash} />
								<p className="deadline-content-complete-text">Completed!</p>
							</div> :
							<div className={`deadline-content-container ${this.firstRowIsEmpty() ? "deadline-content-container-no-date" : ""}`}>
								{!this.firstRowIsEmpty() &&
									<div className="date-countdown-container">
										{this.state.countdown.months != null && this.state.countdown.months > 0 &&
											<p>{this.state.countdown.months} {appendsIfPlural("Month", this.state.countdown.months)}</p>
										}
										{this.state.countdown.weeks != null && this.state.countdown.weeks > 0 &&
											<p>{this.state.countdown.weeks} {appendsIfPlural("Week", this.state.countdown.weeks)}</p>
										}
										{this.state.countdown.days != null && this.state.countdown.days > 0 &&
											<p>{this.state.countdown.days} {appendsIfPlural("Day", this.state.countdown.days)}</p>
										}
									</div>
								}
								<div 
									className="progress-wheel-container" 
									style={{
										justifySelf: this.firstRowIsEmpty() ? "center" : "start"
									}}
								>
									<CircularProgressbar 
										value={this.state.bar.max - this.state.bar.value}
										maxValue={this.state.bar.max}
										text={
											deadlineReached ?
											"Reached" :
											`${formatNumberToClock(this.state.countdown.hours)} : ${formatNumberToClock(this.state.countdown.minutes)} : ${formatNumberToClock(this.state.countdown.seconds)}`
										}
										styles={{
											background: {
												backgroundColor: "transparent",
												fill: "transparent"
											},
											text: {
												fontSize: "0.7rem",
												fontFamily: "'Quantico', sans-serif",
												fill: "#E83D84"
											},
											path: {
												stroke: "#E83D84"
											},
											trail: {
												stroke: "transparent"
											}
										}}
									/>
								</div>
							</div>
						}
					</div>
				}
			</>
		)
	}
}

interface PropsForComponent {
	id: string
	displayText?: string
	deadline: string
	start: string
	accent?: boolean
	deadlines: IDeadlineState
	editMode: boolean
	fieldTwoValid: boolean
	noEditMode: boolean
	replaceCountdownWithDate: boolean
	addCompleteDeadline: IAddCompleteDeadline
	removeCompleteDeadline: IRemoveCompleteDeadline
	setReplaceCountdownWithDateFlag: ISetReplaceCountdownWithDateFlag
	updateElement: (event: React.ChangeEvent<HTMLInputElement>, fieldNum: "first" | "second" | "third") => void
}

interface StateForComponent {
	hash: string
	animatedFlip: number
	complete: boolean
	countdown: {
		months: number
		weeks: number
		days: number
		hours: number
		minutes: number
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
	editMode: state.app.flags.editMode,
	replaceCountdownWithDate: state.app.flags.replaceCountdownWithDate
})

const reduxDispatch = () => ({
	addCompleteDeadline,
	removeCompleteDeadline,
	setReplaceCountdownWithDateFlag
})

export default connect(reduxSelect, reduxDispatch())(DeadlineObject)