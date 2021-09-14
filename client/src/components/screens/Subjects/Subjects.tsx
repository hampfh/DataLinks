import React, { useEffect, useRef } from "react"
import SubjectComponent from "./components/SubjectItem"
import "./components/Switch.css"
import isMobile from "functions/isMobile"
import { version } from "components/../../package.json"
import { connect, useDispatch } from "react-redux"
import { IReduxRootState } from "state/reducers"
import { IAppState } from "state/reducers/app"
import { 
	disableEditModeFlag, 
	enableEditMode, 
	IDisableEditModeFlag, 
	IEnableEditMode, 
	ISetDeadlineViewFlag, 
	ISetExtendViewFlag, 
	setDeadlineViewFlag, 
	setExtendViewFlag 
} from "state/actions/app"
import SubjectSneakPeak from "components/screens/Subjects/components/SneakPeak"
import DeadlineRenderer from "components/templates/DeadlineRenderer"
import { IDimensionState } from "state/reducers/dimensions"
import { ISetTransforms, setTransforms} from "state/actions/dimensions"
import { Link, useParams } from "react-router-dom"
import { LOGO } from "components/utilities/logos"
import { motion } from "framer-motion"
import { animationActive, AnimationCategory, HomeAnimationId, IAnimationState } from "state/reducers/animations"
import { IContentState } from "state/reducers/content"
import { DataLoader } from "functions/DataLoader"
import NotFoundPage from "../404/404"
import DefaultHeader from "components/templates/headers/DefaultHeader"
import SubjectsLayout from "./components/SubjectsLayout"

const uiDistribution = {
	dynamic: {
		SUBJECTS: 0.39,
		CONTENT: 0.61,	
	},
	static: {
		TOOLBAR: 90
	}
}

const desktopWidth = 800

function Subjects(props: PropsForComponent) {

	return (
		<div>
			<DefaultHeader />
			<SubjectsLayout />
		</div>
	)

	/* const dispatch = useDispatch()
	const { program } = useParams<IRouterParams>()

	const subjectContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		DataLoader.manageProgramContentData(program)

		let debouncer: NodeJS.Timeout | undefined
		function _onResize() {
			if (debouncer)
				clearTimeout(debouncer)
			debouncer = setTimeout(performResize, 10)
		}

		window.addEventListener("resize", _onResize)

		setTimeout(() => {
			dispatch({ type: "SET_ANIMATION_STATUS", payload: { category: AnimationCategory.HOME, animation: HomeAnimationId.GIVE_FEEDBACK_DROP_DOWN, status: true }})
		}, 200)

		return () => {
			window.removeEventListener("resize", _onResize)
			if (debouncer)
				clearTimeout(debouncer)
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		// If heights does't match, resize page
		if (subjectContainerRef && subjectContainerRef.current && subjectContainerRef.current.clientHeight !== props.dimensions.subjects.height)
			performResize()
	})

	const performResize = () => {
		const windowHeightAfterStatic = window.innerHeight - uiDistribution.static.TOOLBAR

		if (!subjectContainerRef || !subjectContainerRef.current)
			return

		const contentHeight = windowHeightAfterStatic - subjectContainerRef.current?.clientHeight ?? windowHeightAfterStatic

		// Calculate and update dimensions
		props.setTransforms({
			window: {
				width: window.innerWidth,
				height: window.innerHeight
			},
			subjects: {
				width: window.innerWidth,
				height: subjectContainerRef.current?.clientHeight ?? null
			},
			content: {
				width: window.innerWidth,
				// 144px is 9 rems which is the size of a deadline
				height: contentHeight <= 144 ? 0 : contentHeight
			},
			toolbar: {
				width: window.innerWidth,
				height: uiDistribution.static.TOOLBAR
			}
		})
	}

	function _onflick(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.checked) 
			props.enableEditMode()
		else
			props.disableEditModeFlag()
	}

	function _onExtendModeFlick(event: React.ChangeEvent<HTMLInputElement>) {
		props.setExtendViewFlag(event.target.checked)
	}
	function _onDeadlineViewFlick(event: React.ChangeEvent<HTMLInputElement>) {
		props.setDeadlineViewFlag(event.target.checked)
	}

	if (!props.content.hasLoaded)
		return null

	if (props.content.hasLoaded && props.content.activeProgramId == null)
		return <NotFoundPage />

	return (
		<section className="Master">
			<div className="Uppercontainer" 
				ref={subjectContainerRef}
			>
				{props.app.flags.extendedView ? null : 
					<div>
						<motion.div className="feedbackWrapper" animate={animationActive(props.animations, AnimationCategory.HOME, HomeAnimationId.GIVE_FEEDBACK_DROP_DOWN) ? "" : {
							y: [-100, 0]
						}}>
							<a href="https://github.com/hampfh/DataLinks/issues">
								<div className="feedbackContainer">
									Give Feedback
								</div>
							</a>
						</motion.div>
						<h1 className="Title">{DataLoader.getActiveProgram()?.name} links</h1>
						<h3 className="versionText">Version: {version}</h3>
						<div className="leaderboardButtonWrapper">
							<Link className="leaderboardLink" to={`/${DataLoader.getActiveProgram()?.name ?? 404}/contributors`}>
								<div className="leaderboardButton">
									Contributor leaderboard
								</div>
							</Link>
							<Link className="leaderboardLink" to={`/${DataLoader.getActiveProgram()?.name ?? 404}/archive`}>
								<div className="leaderboardButton">
									Course archive
								</div>
							</Link>
						</div>
					</div>
				}
				<div className="SubjectContainer">
					{
						props.content.activeProgramSubjects.map((subject) => {
							if (subject.group == null || subject.archived)
								return null
							else {
								return <SubjectComponent
									key={subject.code}
									subject={subject}
									updateSubjects={props.updateSubjects}
								/>
							}
						})
					}
				</div>
			</div>
			{props.app.sneakPeak == null || props.dimensions.window.width < desktopWidth || props.dimensions.window.height < 600 || isMobile() ? null :
				<SubjectSneakPeak
					updateSubjects={props.updateSubjects}
				/>
			}
			{props.app.flags.deadlineView && props.app.sneakPeakSelectionCount <= 0 && props.dimensions.window.width > desktopWidth ? 
				<DeadlineRenderer
					subjects={props.content.activeProgramSubjects}
				/>: null
			}

			{isMobile() || props.dimensions.window.height < 500 || props.dimensions.window.width < desktopWidth ? null : 
				<div className="bottomContainer"
					style={{
						height: props.dimensions.toolbar.height
					}}
				>
					<div className="extendModeContainer  toolbarItem">
						<p>Content view</p>
						<label className="switch">
							<input onChange={_onExtendModeFlick} checked={props.app.flags.extendedView} type="checkbox" />
							<span className="slider round"></span>
						</label>
					</div>
					<div className="editModeContainer toolbarItem">
						<p>Edit mode</p>
						<label className="switch">
							<input onChange={_onflick} checked={props.app.flags.editMode} type="checkbox" />
							<span className="slider round"></span>
						</label>
					</div>
					<div className="editModeContainer toolbarItem">
						<p>Deadline view</p>
						<label className="switch">
							<input onChange={_onDeadlineViewFlick} checked={props.app.flags.deadlineView} type="checkbox" />
							<span className="slider round"></span>
						</label>
					</div>
				</div>
			}
		</section>
	) */
}

export interface SubjectData {
	_id: string,
	name: string,
	code: string,
	description: string,
	logo: LOGO,
	color: string,
	group: Group,
	archived: boolean,
	createdAt: Date,
	updatedAt: Date,
	__v: number
}

interface PropsForComponent {
	content: IContentState,
	app: IAppState,
	dimensions: IDimensionState,
	animations: IAnimationState,
	updateSubjects: () => void,
	enableEditMode: IEnableEditMode,
	disableEditModeFlag: IDisableEditModeFlag,
	setExtendViewFlag: ISetExtendViewFlag,
	setDeadlineViewFlag: ISetDeadlineViewFlag,
	setTransforms: ISetTransforms
}

const reduxSelect = (state: IReduxRootState) => ({
	app: state.app,
	dimensions: state.dimensions,
	animations: state.animations,
	content: state.content
})

const reduxDispatch = () => ({
	enableEditMode,
	disableEditModeFlag,
	setExtendViewFlag,
	setDeadlineViewFlag,
	setTransforms
})

export default connect(reduxSelect, reduxDispatch())(Subjects)