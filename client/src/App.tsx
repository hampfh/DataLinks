import React, { Component } from 'react';
import Subjects from "components/screens/Subjects/Subjects"
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { v4 as uuid } from "uuid"
import { connect } from 'react-redux';

import './App.css';
import { SubjectData } from "components/screens/Subjects/Subjects"
import Http, { HttpReturnType } from "functions/HttpRequest"
import SubjectView from "components/screens/Subject/SubjectView"
import { IReduxRootState } from 'state/reducers';
import { IAppState } from 'state/reducers/app';
import { 
	enableEditMode, 
	IEnableEditMode, 
	ISetExtendViewFlag, 
	ISetDeadlineViewFlag, 
	loadFlags, 
	setDeadlineViewFlag, 
	setExtendViewFlag 
} from 'state/actions/app'
import { 
	ISetCompletedDeadlines, 
	loadCompletedDeadlines, 
	setCompletedDeadlines 
} from 'state/actions/deadlines';
import Socket from "components/utilities/SocketManager"

export type ContentType = "Text" | "Link" | "Deadline" | "Group"

class App extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)
		this.state = {
			subjects: [],
			hasLoaded: false
		}
	}

	componentDidMount() {
		this._updateSubjects(() => {
			// Content has loaded
			const newState = { ...this.state }
			newState.hasLoaded = true;
			this.setState(newState)
		})

		// Load setting flags from localstorage
		const flags = loadFlags()
		if (flags) {
			if (flags.editMode)
				this.props.enableEditMode()
			if (flags.extendedView)
				this.props.setExtendViewFlag(true)
			if (flags.deadlineView)
				this.props.setDeadlineViewFlag(true)
		}

		// Load completed deadlines from localstorage
		const completedDeadlines = loadCompletedDeadlines()
		this.props.setCompletedDeadlines(completedDeadlines)
	}

	_updateSubjects = async (callback?: () => void) => {
		const response = (await Http({
			url: "/api/v1/subject",
			method: "GET",
			body: {

			}
		})) as HttpReturnType & {
			result: Array<SubjectData>
		}

		const newState = { ...this.state }
		newState.subjects = response.result
		this.setState(newState, () => {
			if (callback != null)
				callback()
		})
	}
	
	render() {
		if (this.state.subjects === undefined)
			return null
		return (
			<Router>
				<Switch>
					<Route exact path="/">
						<Redirect to="/D20"/>
					</Route>
					<Route exact path="/D20">
						<Socket subscribeTo="subjectItem" callback={() => {
							console.log("Change made")
						}} />
						<Subjects 
							subjects={this.state.subjects} 
							updateSubjects={this._updateSubjects}
						/>
					</Route>
					{this.state.subjects.map((subject) => {
						return (
							<Route key={uuid()} exact path={`/D20/course/${subject.code}`}>
								<SubjectView
									updateSubjects={this._updateSubjects}
									subject={subject}
								/>
							</Route>
						)
					})}
					{this.state.hasLoaded ? 
						<Route>
							<div className="404Container">
								<h1>404</h1>
								<h2>Oups, page not found</h2>
								<p>Return back to the <a href="/">home</a> page</p>
							</div>
						</Route> : null
					}
				</Switch>
			</Router>
		);
	}
}

export interface PropsForComponent {
	app: IAppState,
	enableEditMode: IEnableEditMode,
	setExtendViewFlag: ISetExtendViewFlag,
	setDeadlineViewFlag: ISetDeadlineViewFlag,
	setCompletedDeadlines: ISetCompletedDeadlines
}

export interface StateForComponent {
	subjects: SubjectData[],
	hasLoaded: boolean
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		app: state.app
	}
}

const reduxDispatch = () => {
	
	return {
		enableEditMode,
		setExtendViewFlag,
		setDeadlineViewFlag,
		setCompletedDeadlines
	}
}

export default connect(reduxSelect, reduxDispatch())(App);
