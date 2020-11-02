import React, { Component } from 'react'
import SubjectComponent from "./components/SubjectItem"
import "./Subjects.css"
import "./components/Switch.css"
import { Group } from "../../templates/RenderData"
import isMobile from "../../../functions/isMobile"
import { version } from "../../../../package.json"
import { connect } from 'react-redux'
import { IReduxRootState } from '../../../state/reducers'
import { IAppState } from '../../../state/reducers/app'
import { disableEditModeFlag, enableEditMode, IDisableEditModeFlag, IEnableEditMode, ISetDeadlineViewFlag, ISetExtendViewFlag, setDeadlineViewFlag, setExtendViewFlag } from '../../../state/actions/app'
import SubjectSneakPeak from "../Subjects/components/SneakPeak"
import DeadlineRenderer from '../../templates/DeadlineRenderer'

export class Subjects extends Component<PropsForComponent> {

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
				<div className="Uppercontainer">
					{this.props.app.flags.extendedView ? null : 
						<div>
							<h1 className="Title">D20 links</h1>
							<h3 className="versionText">Version: {version}</h3>
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
				<div className="SneakPeakContainer">
					{this.props.app.sneakPeak == null || window.innerWidth < 750 || window.innerHeight < 600 || isMobile() ? null :
						<SubjectSneakPeak
							updateSubjects={this.props.updateSubjects}
						/>
					}
				</div>
				{this.props.app.flags.deadlineView && this.props.app.sneakPeakSelectionCount <= 0 ? 
					<DeadlineRenderer
						subjects={this.props.subjects}
					/>: null
				}

				{isMobile() || window.innerHeight < 500 || window.innerWidth < 600 ? null : 
					<div className="bottomContainer">
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
	color: string,
	group: Group
}

interface PropsForComponent {
	subjects: SubjectData[],
	app: IAppState,
	updateSubjects: () => void,
	enableEditMode: IEnableEditMode,
	disableEditModeFlag: IDisableEditModeFlag,
	setExtendViewFlag: ISetExtendViewFlag,
	setDeadlineViewFlag: ISetDeadlineViewFlag
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		app: state.app
	}
}

const reduxDispatch = () => {
	return {
		enableEditMode,
		disableEditModeFlag,
		setExtendViewFlag,
		setDeadlineViewFlag
	}
}

export default connect(reduxSelect, reduxDispatch())(Subjects)