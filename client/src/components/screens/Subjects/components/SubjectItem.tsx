import { useEffect } from 'react'
import "./SubjectItem.css"
import "./Animation.css"
import { SubjectData } from '../Subjects'
import { useHistory } from "react-router-dom"

import { IReduxRootState } from "state/reducers"
import { connect } from "react-redux"
import { IAppState } from "state/reducers/app"
import { 
	hideSneakPeak, 
	IHideSneakPeak, 
	IShowSneakPeak, 
	showSneakPeak 
} from "state/actions/app"
import { motion } from 'framer-motion'
import { DataLoader } from 'functions/DataLoader'
import SubjectItemColorBlob from './SubjectItemColorBlob'

function Subject(props: PropsForComponent) {

	let collapseStateTimeout: NodeJS.Timeout
	let mouseLeaveLock: NodeJS.Timeout

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

	function onClick() {
		history.push(`/${DataLoader.getActiveProgram()?.name ?? 404}/course/${props.subject.code}`)
	}

	function mouseEnter() {
		props.hideSneakPeak()
		props.showSneakPeak(props.subject)
	}

	return (
		<motion.div 
			onClick={onClick}
			onHoverStart={mouseEnter}
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
	updateSubjects: () => void
}

const reduxSelect = (state: IReduxRootState) => ({
	app: state.app
})

const reduxDispatch = () => ({
	showSneakPeak,
	hideSneakPeak
})

export default connect(reduxSelect, reduxDispatch())(Subject)
