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
import { disableEditMode, enableEditMode, IDisableEditMode, IEnableEditMode } from '../../../state/actions/app'
import SubjectSneakPeak from "../Subjects/components/SneakPeak"

export class Subjects extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			elementsHidden: false,
			sneakPeak: undefined,
		}
	}

	_onflick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) 
			this.props.enableEditMode()
		else
			this.props.disableEditMode()
	}

	render() {
		return (
			<section className="Master">
				<div className="Uppercontainer">
					<div>
						<h1 className="Title">D20 links</h1>
						<h3 className="versionText">Version: {version}</h3>
					</div>
					{isMobile() ? null :
						<div className="editModeContainer">
							<p>Default mode</p>
							<label className="switch">
								<input onChange={this._onflick} checked={this.props.app.editMode} type="checkbox" />
								<span className="slider round"></span>
							</label>
							<p>Edit mode</p>
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
				{this.props.app.sneakPeak == null || window.innerWidth < 750 || window.innerHeight < 600 || isMobile() ? null :
					<SubjectSneakPeak
						updateSubjects={this.props.updateSubjects}
					/>
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
	disableEditMode: IDisableEditMode
}

interface StateForComponent {
	elementsHidden: boolean,
	sneakPeak?: SubjectData
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		app: state.app
	}
}

const reduxDispatch = () => {
	return {
		enableEditMode,
		disableEditMode
	}
}

export default connect(reduxSelect, reduxDispatch())(Subjects)