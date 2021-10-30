import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { calcDeadlinePercentage, calcTimeLeft, formatDate, formatNumberToClock } from "functions/date_calculations"
import "./Deadline.css"
import { 
	addCompleteDeadline, 
	IAddCompleteDeadline, 
	IRemoveCompleteDeadline, 
	loadCompletedDeadlines, 
	removeCompleteDeadline,
} from "state/actions/deadlines"
import { IReduxRootState } from "state/reducers"
import { ISetReplaceCountdownWithDateFlag, setReplaceCountdownWithDateFlag } from 'state/actions/app'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { appendsIfPlural } from 'functions/string_formatting'
import Checkmark from 'components/screens/Subject/components/Checkmark'
import moment from 'moment'

function DeadlineObject(props: PropsForComponent) {

	const id = props.id.toString()
	const [animationTimeout, setAnimationTimeout] = useState<NodeJS.Timeout>()
	
	const [animatedFlip, setAnimatedFlip] = useState(0)
	const [completed, setCompleted] = useState(loadCompletedDeadlines().find(current => current === id) != null)
	const [remaining, setRemaining] = useState<{
        months: number
        weeks: number
        days: number
        hours: number
        minutes: number
        seconds: number
    }>(calcTimeLeft(props.deadline))
	const [progress, setProgress] = useState<{
		max: number
		value: number
	}>(calcDeadlinePercentage(props.start, props.deadline))

	useEffect(() => {
		return () => {
			if (animationTimeout)
				clearTimeout(animationTimeout)
		}
	}, [animationTimeout])

	useEffect(() => {
		const interval = setInterval(() => {
			setRemaining(calcTimeLeft(props.deadline))
			setProgress(calcDeadlinePercentage(props.start, props.deadline))
		}, 1000)
		return () => {
			clearInterval(interval)	
		}
	}, [props.deadline, props.start])

	function firstRowIsEmpty() {
		return !!!remaining.months && !!!remaining.weeks && !!!remaining.days
	}

	function clickCard() {
		
		setAnimatedFlip(1)		

		if (animationTimeout)
			clearTimeout(animationTimeout)

		// Wait for first rotation
		setAnimationTimeout(setTimeout(() => {
			setCompleted(!completed)
			setAnimatedFlip(0)
			setAnimationTimeout(setTimeout(() => {
				if (completed)
					props.removeCompleteDeadline(id)
				else
					props.addCompleteDeadline(id)
			}, 250))
		}, 250))
	}
	
	/* function toggleDeadlineContent() {
		props.setReplaceCountdownWithDateFlag(!props.replaceCountdownWithDate)
	} */

	function deadlineReached() {
		return (
			remaining.months === 0 &&
			remaining.weeks === 0 &&
			remaining.days === 0 &&
			remaining.hours === 0 &&
			remaining.minutes === 0 &&
			remaining.seconds === 0
		)
	} 

	

	return (
		<>
			{props.editMode && !props.noEditMode ? 
				// Edit mode
				<div className="default-nested-box-container editmode">
					<div className="editModeField">
						<label htmlFor="fieldOne" className="editLabel">Deadline description</label>
						<input
							className="editModeInputField"
							disabled={props.id.toString().length === 0}
							name="fieldOne"
							value={props.displayText}
							onChange={(event) => props.updateElement(event, "first")}
						/>
					</div>
					<div className="editModeField">
						<p style={{
							color: props.fieldTwoValid ? "transparent" : "#fff",
							textDecoration: "underline",
							marginTop: "0",
							marginBottom: "0.1rem"
						}}>Deadline is not formatted correctly</p>
						<label htmlFor="fieldTwo" className="editLabel">Deadline (YYYY-MM-DD HH:mm)</label>
						<input
							className="editModeInputField"
							disabled={props.id.toString().length === 0}
							name="fieldTwo"
							value={props.deadline}
							onChange={(event) => props.updateElement(event, "second")}
							placeholder={"YYYY-MM-DD HH:mm"}
						/>
					</div>
				</div> :
				// Non-edit mode 
				<div 
					title={`${completed ? "Mark uncompleted" : "Mark completed"}`}
					onClick={clickCard}
					className={`default-nested-box-container deadline-container ${animatedFlip === 1 ? "animated" : ""}`}
				>
					{props.displayText &&
						<p className="deadline-title-text">{props.displayText}</p>
					}
					{completed ? 
						<div className="deadline-content-container completed">
							<Checkmark animate={completed} />
							<p className="deadline-content-complete-text">Completed!</p>
						</div> :
						<div className={`deadline-content-container ${firstRowIsEmpty() ? "deadline-content-container-no-date" : ""}`}>
							{!firstRowIsEmpty() &&
								<div className="date-countdown-container">
									{remaining.months != null && remaining.months > 0 &&
										<p>{remaining.months} {appendsIfPlural("Month", remaining.months)}</p>
									}
									{remaining.weeks != null && remaining.weeks > 0 &&
										<p>{remaining.weeks} {appendsIfPlural("Week", remaining.weeks)}</p>
									}
									{remaining.days != null && remaining.days > 0 &&
										<p>{remaining.days} {appendsIfPlural("Day", remaining.days)}</p>
									}
								</div>
							}
							<div 
								className="progress-wheel-container" 
								style={{
									justifySelf: firstRowIsEmpty() ? "center" : "start"
								}}
							>
								<CircularProgressbar 
									value={progress.max - progress.value}
									maxValue={progress.max}
									text={
										deadlineReached() ?
										"Reached" :
										`${formatNumberToClock(remaining.hours)} : ${formatNumberToClock(remaining.minutes)} : ${formatNumberToClock(remaining.seconds)}`
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
					<div className="date-display-container">
						<p className="date-display-text">{formatDate(props.deadline)}</p>
						<p className="date-display-text-time">{moment(props.deadline).format("HH:mm")}</p>
					</div>
				</div>
			}
		</>
	)
}

interface PropsForComponent {
	id: string
	displayText?: string
	deadline: string
	start: string
	accent?: boolean
	editMode: boolean
	fieldTwoValid: boolean
	noEditMode: boolean
	replaceCountdownWithDate: boolean
	addCompleteDeadline: IAddCompleteDeadline
	removeCompleteDeadline: IRemoveCompleteDeadline
	setReplaceCountdownWithDateFlag: ISetReplaceCountdownWithDateFlag
	updateElement: (event: React.ChangeEvent<HTMLInputElement>, fieldNum: "first" | "second" | "third") => void
}

const reduxSelect = (state: IReduxRootState) => ({
	editMode: state.app.flags.editMode,
	replaceCountdownWithDate: state.app.flags.replaceCountdownWithDate
})

const reduxDispatch = () => ({
	addCompleteDeadline,
	removeCompleteDeadline,
	setReplaceCountdownWithDateFlag
})

export default connect(reduxSelect, reduxDispatch())(DeadlineObject)