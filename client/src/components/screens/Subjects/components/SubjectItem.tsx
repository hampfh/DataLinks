import { useEffect, useState } from 'react'
import "./SubjectItem.css"
import "./Animation.css"
import { SubjectData } from '../Subjects'
import { Redirect, useHistory } from "react-router-dom"

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
import { DataLoader } from 'functions/DataLoader'
import SubjectItemColorBlob from './SubjectItemColorBlob'

function Subject(props: PropsForComponent) {

	let collapseStateTimeout: NodeJS.Timeout
	let mouseLeaveLock: NodeJS.Timeout

	const [collapsState, setCollapsState] = useState(0)
	const [hovering, setHovering] = useState(false)

	const history = useHistory()

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
				history.push(`/${DataLoader.getActiveProgram()?.name ?? 404}/course/${props.subject.code}`)
			}, 100)
			props.hideSneakPeak()
		}
	}

	function _mouseEnter() {
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
		<motion.div 
			onHoverStart={_mouseEnter}
			onHoverEnd={_mouseLeave}
			className="default-nested-box-container default-nested-box-container-hover subject-item-wrapper"
		>
			<div className="subject-item-container">
				<div className="subject-item-header-container">
					<SubjectItemColorBlob />
					<h4>{props.subject.code}</h4>
				</div>
				<p>{props.subject.name}</p>
			</div>
		</motion.div>
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
