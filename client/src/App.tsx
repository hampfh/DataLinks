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
	setExtendViewFlag, 
	setContributor,
	ISetContributor,
	APP_CONTRIBUTOR_KEY,
	setFingerPrint,
	ISetFingerPrint
} from 'state/actions/app'
import { 
	ISetCompletedDeadlines, 
	loadCompletedDeadlines, 
	setCompletedDeadlines 
} from 'state/actions/deadlines';
import { addLocal, deleteLocally, IAddLocal, IDeleteLocally } from 'state/actions/local';
import Subscriptions from 'components/utilities/Subscriptions';
import { ContentObject } from 'components/templates/RenderData';
import { updateElement } from 'functions/updateElement';
import SubmitContributorName from 'components/templates/SubmitContributorName';
import FingerPrint from '@fingerprintjs/fingerprintjs'
import Contributors from 'components/screens/Contributors/Contributors';

export type ContentType = "TEXT" | "LINK" | "DEADLINE" | "GROUP"
export type OperationType = "CREATE" | "UPDATE" | "DELETE"

class App extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)
		this.state = {
			subjects: [],
			hasLoaded: false,
			showContributorOverlay: false
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

		// Load contributor (if it's set)
		const contributor = localStorage.getItem(APP_CONTRIBUTOR_KEY)
		if (contributor != null) {
			this.props.setContributor(contributor)
		}

		// Initialize fingerprint
		(async () => {
			const fp =  await FingerPrint.load();
			const result = await fp.get()
			this.props.setFingerPrint(result.visitorId)
		})();
	}

	componentDidUpdate() {
		if (this.props.app.flags.editMode && 
			localStorage.getItem(APP_CONTRIBUTOR_KEY) == null
			&& !!!this.state.showContributorOverlay
		) {
			this.toggleContributionForm(true)
		}
	}

	toggleContributionForm = (state: boolean) => {
		let newState = { ...this.state }
		newState.showContributorOverlay = state
		this.setState(newState)
	}

	_updateSubjects = async (callback?: () => void) => {
		const response = (await Http({
			url: "/api/v1/subject",
			method: "GET",
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

	_updateRawElement = (newElement: ContentObject) => {
		let newState = { ...this.state }
		updateElement(newState.subjects, newElement)
		this.setState(newState)
	}
	
	render() {
		// Render contribution form if contributor isn't set
		if (this.state.showContributorOverlay)
			return <SubmitContributorName toggleView={this.toggleContributionForm} />
		if (this.state.subjects === undefined)
			return null
		return (
			<Router>
				<Switch>
					<Route exact path="/">
						<Redirect to="/D20"/>
					</Route>
					<Route exact path="/D20">
						<Subscriptions updateRawData={this._updateRawElement} />
						
						<Subjects 
							subjects={this.state.subjects} 
							updateSubjects={this._updateSubjects}
						/>
					</Route>
					<Route exact path="/D20/contributors">
						<Contributors />
					</Route>
					{this.state.subjects.map((subject) => {
						return (
							<Route key={uuid()} exact path={`/D20/course/${subject.code}`}>
								<Subscriptions updateRawData={this._updateRawElement} />
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
	setCompletedDeadlines: ISetCompletedDeadlines,
	addLocal: IAddLocal,
	deleteLocally: IDeleteLocally,
	setContributor: ISetContributor,
	setFingerPrint: ISetFingerPrint
}

export interface StateForComponent {
	subjects: SubjectData[],
	hasLoaded: boolean,
	showContributorOverlay: boolean
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		app: state.app,
		local: state.local
	}
}

const reduxDispatch = () => {
	return {
		enableEditMode,
		setExtendViewFlag,
		setDeadlineViewFlag,
		setCompletedDeadlines,
		addLocal,
		deleteLocally,
		setContributor,
		setFingerPrint
	}
}

export default connect(reduxSelect, reduxDispatch())(App);
