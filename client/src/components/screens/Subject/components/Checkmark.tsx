import "./Checkmark.css"
import { connect } from "react-redux"
import { IReduxRootState } from "state/reducers"
import { IDeadlineState } from 'state/reducers/deadlines'
import { useState } from "react"

function Checkmark(props: PropsForComponent) {

	const [animated, ] = useState(false)

	return (
		<div 
			className="centerCheckmarkAligner"
		>
			<svg 
				className={`checkmark ${animated ? "" : "animate"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"
			>
				<circle className={`checkmark__circle ${animated ? "" : "animate"}`} cx="26" cy="26" r="25" fill="none" />
				<path className={`checkmark__check ${animated ? "" : "animate"}`} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
			</svg>
		</div>
	)
}

interface PropsForComponent {
	deadlineId: string
	deadlines: IDeadlineState
}

const reduxSelect = (state: IReduxRootState) => ({
	deadlines: state.deadlines
})

export default connect(reduxSelect)(Checkmark)