import React, { Component, createRef } from "react"
import SubjectComponent from "./components/SubjectItem"
import "./Subjects.css"
import "./components/Switch.css"
import { Group } from "components/templates/RenderData"
import isMobile from "functions/isMobile"
import { version } from "components/../../package.json"
import { connect } from "react-redux"
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
//import { ISetTransforms, setTransforms } from '../../../state/actions/dimensions'
import { ISetTransforms, setTransforms} from "state/actions/dimensions"
import { Link } from "react-router-dom"
import { LOGO } from "components/utilities/logos"

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

export class Subjects extends Component<PropsForComponent> {

	debouncer?: NodeJS.Timeout
	subjectContainerRef?: React.RefObject<HTMLDivElement>

	constructor(props: PropsForComponent) {
		super(props)
		this.subjectContainerRef = createRef()
	}

	componentDidMount() {
		window.addEventListener("resize", this._onResize)
	}

	componentDidUpdate() {
		// If heights does't match, resize page
		if (this.subjectContainerRef && this.subjectContainerRef.current && this.subjectContainerRef.current.clientHeight !== this.props.dimensions.subjects.height)
			this.performResize()
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this._onResize)
		if (this.debouncer)
			clearTimeout(this.debouncer)
	}

	_onResize = () => {
		if (this.debouncer)
			clearTimeout(this.debouncer)
		this.debouncer = setTimeout(this.performResize, 10)
	}

	performResize = () => {
		const windowHeightAfterStatic = window.innerHeight - uiDistribution.static.TOOLBAR

		if (!this.subjectContainerRef || !this.subjectContainerRef.current)
			return

		const contentHeight = windowHeightAfterStatic - this.subjectContainerRef.current?.clientHeight ?? windowHeightAfterStatic

		// Calculate and update dimensions
		this.props.setTransforms({
			window: {
				width: window.innerWidth,
				height: window.innerHeight
			},
			subjects: {
				width: window.innerWidth,
				height: this.subjectContainerRef.current.clientHeight
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

	_onflick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) 
			this.props.enableEditMode()
		else
			this.props.disableEditModeFlag()
	}

	_onExtendModeFlick = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.props.setExtendViewFlag(event.target.checked)
	}
	_onDeadlineViewFlick = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.props.setDeadlineViewFlag(event.target.checked)
	}

	render() {
		return (
			<section className="Master">
				<div className="Uppercontainer" 
					ref={this.subjectContainerRef}
				>
					{this.props.app.flags.extendedView ? null : 
						<div>
							<div className="feedbackWrapper">
								<a href="https://github.com/hampfh/DataLinks/issues">
									<div className="feedbackContainer">
										Give Feedback
									</div>
								</a>
							</div>
							<h1 className="Title">D20 links</h1>
							<h3 className="versionText">Version: {version}</h3>
							<div className="leaderboardButtonWrapper">
								<Link className="leaderboardLink" to="/D20/contributors">
									<div className="leaderboardButton">
										Contributor leaderboard
									</div>
								</Link>
							</div>
						</div>
					}
					<div className="SubjectContainer">
						{
							this.props.subjects.map((subject) => {
								if (subject.group == null)
									return null
								else {
									return <SubjectComponent
										key={subject.code}
										subject={subject}
										updateSubjects={this.props.updateSubjects}
									/>
								}
							})
						}
					</div>
				</div>
				{this.props.app.sneakPeak == null || this.props.dimensions.window.width < desktopWidth || this.props.dimensions.window.height < 600 || isMobile() ? null :
					<SubjectSneakPeak
						updateSubjects={this.props.updateSubjects}
					/>
				}
				{this.props.app.flags.deadlineView && this.props.app.sneakPeakSelectionCount <= 0 && this.props.dimensions.window.width > desktopWidth ? 
					<DeadlineRenderer
						subjects={this.props.subjects}
					/>: null
				}

				{isMobile() || this.props.dimensions.window.height < 500 || this.props.dimensions.window.width < desktopWidth ? null : 
					<div className="bottomContainer"
						style={{
							height: this.props.dimensions.toolbar.height
						}}
					>
						<div className="extendModeContainer  toolbarItem">
							<p>Content view</p>
							<label className="switch">
								<input onChange={this._onExtendModeFlick} checked={this.props.app.flags.extendedView} type="checkbox" />
								<span className="slider round"></span>
							</label>
						</div>
						<div className="editModeContainer toolbarItem">
							<p>Edit mode</p>
							<label className="switch">
								<input onChange={this._onflick} checked={this.props.app.flags.editMode} type="checkbox" />
								<span className="slider round"></span>
							</label>
						</div>
						<div className="editModeContainer toolbarItem">
							<p>Deadline view</p>
							<label className="switch">
								<input onChange={this._onDeadlineViewFlick} checked={this.props.app.flags.deadlineView} type="checkbox" />
								<span className="slider round"></span>
							</label>
						</div>
					</div>
				}
			</section>
		)
	}
}

export interface SubjectData {
	_id: string,
	name: string,
	code: string,
	description: string,
	logo: LOGO,
	color: string,
	group: Group
}

interface PropsForComponent {
	subjects: SubjectData[],
	app: IAppState,
	dimensions: IDimensionState,
	updateSubjects: () => void,
	enableEditMode: IEnableEditMode,
	disableEditModeFlag: IDisableEditModeFlag,
	setExtendViewFlag: ISetExtendViewFlag,
	setDeadlineViewFlag: ISetDeadlineViewFlag,
	setTransforms: ISetTransforms
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		app: state.app,
		dimensions: state.dimensions
	}
}

const reduxDispatch = () => {
	return {
		enableEditMode,
		disableEditModeFlag,
		setExtendViewFlag,
		setDeadlineViewFlag,
		setTransforms
	}
}

export default connect(reduxSelect, reduxDispatch())(Subjects)