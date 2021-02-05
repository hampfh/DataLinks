import { useEffect, useState } from 'react'
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
import { motion } from 'framer-motion'

function Subject(props: PropsForComponent) {

	let collapseStateTimeout: NodeJS.Timeout
	let mouseLeaveLock: NodeJS.Timeout

	const [collapsState, setCollapsState] = useState(0)
	const [hovering, setHovering] = useState(false)

	/* shouldComponentUpdate(newProps: PropsForComponent, newState: StateForComponent) {
		if (newProps.app.sneakPeak?._id.toString() === this.props.app.sneakPeak?._id.toString() && 
		newState.collapsState === this.state.collapsState)
			return false

		return true;
	} */

	useEffect(() => {
		return () => {
			if (collapseStateTimeout)
				clearTimeout(collapseStateTimeout)
			if (mouseLeaveLock)
				clearTimeout(mouseLeaveLock)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function _onClick() {
		// Extend the subject container
		if (collapsState === 0) {
			setCollapsState(2)

			collapseStateTimeout = setTimeout(() => {
				setCollapsState(3)
			}, 100)
			props.hideSneakPeak()
		}
	}

	function _mouseEnter() {

		// We don't need to set it again
		if (props.subject._id.toString() === props.app.sneakPeak?._id.toString()) {
			props.showSneakPeak(props.subject)
			return
		}

		props.showSneakPeak(props.subject)
	}

	function _mouseLeave() {
		if (props.subject._id.toString() === props.app.sneakPeak?._id.toString()) {
			mouseLeaveLock = setTimeout(() => {
				// Lower selection score
				props.setSneakPeakSelectionCount(-1)
			}, 10)
		}
	}

	return (
		<div className="SubjectItemWrapper">
			{collapsState !== 3 ? 
				<motion.div className="Subject" 
					onClick={_onClick} 
					onMouseLeave={_mouseLeave}
					initial={{
						boxShadow: "none"
					}}
					animate={hovering ? {
						boxShadow: "0px 0px 20px -8px #000000"
					} : {
						boxShadow: "0px 0px 0px 0px #000000"
					}}
					transition={{ duration: hovering ? 0.05 : 0 }}
				>
					<motion.img alt="Subject icon"
						onHoverStart={() => setHovering(true)}
						onHoverEnd={() => setHovering(false)}
						onMouseEnter={_mouseEnter}
						className={`${collapsState === 0 ? "collapsed" : ""}`} 
						src={getSubjectIcon(props.subject.logo)} 
					/>
					<h4 className="Header">{props.subject.code}</h4>
				</motion.div>
				: null
			}
			{collapsState === 3 ? 
				<Redirect to={`/D20/course/${props.subject.code}`} /> : null
			}
		</div>
	)
}

export interface StateForComponent {
	collapsState: number,
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
