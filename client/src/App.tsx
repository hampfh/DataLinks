import { useEffect, useState } from 'react';
import Subjects from "components/screens/Subjects/Subjects"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';

import './App.css';
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
	ISetFingerPrint,
	setReplaceCountdownWithDateFlag,
	ISetReplaceCountdownWithDateFlag
} from 'state/actions/app'
import { 
	ISetCompletedDeadlines, 
	loadCompletedDeadlines, 
	setCompletedDeadlines 
} from 'state/actions/deadlines';
import Subscriptions from 'components/utilities/Subscriptions';
import SubmitContributorName from 'components/templates/SubmitContributorName';
import FingerPrint from '@fingerprintjs/fingerprintjs'
import Contributors from 'components/screens/Contributors/Contributors';
import { fetchUpdatedSubjects } from 'functions/updateSubjects';
import { useDispatch } from "react-redux"
import { IContentState } from 'state/reducers/content';
import { version } from "../package.json"
import Archive from 'components/screens/Archive/Archive';
import Home from 'components/screens/Home/Home';
import NotFoundPage from 'components/screens/404/404';
import { incomingVersionIsNewer } from 'functions/version_check';

export type OperationType = "CREATE" | "UPDATE" | "DELETE"

function App(props: PropsForComponent) {

	const dispatch = useDispatch()
	const [showContributionOverlay, setShowContributionOverlay] = useState(false)

	const { enableEditMode, setExtendViewFlag, setDeadlineViewFlag, setCompletedDeadlines, setContributor, setFingerPrint, setReplaceCountdownWithDateFlag } = props

	useEffect(() => {
		manageVersion()

		// Load setting flags from localstorage
		const flags = loadFlags()
		if (flags) {
			if (flags.editMode)
				enableEditMode()
			if (flags.extendedView)
				setExtendViewFlag(true)
			if (flags.deadlineView)
				setDeadlineViewFlag(true)
			if (flags.replaceCountdownWithDate)
				setReplaceCountdownWithDateFlag(true)
		}

		// Load completed deadlines from localstorage
		const completedDeadlines = loadCompletedDeadlines()
		setCompletedDeadlines(completedDeadlines)

		// Load contributor (if it's set)
		const contributor = localStorage.getItem(APP_CONTRIBUTOR_KEY)
		if (contributor != null) {
			setContributor(contributor)
		}

		// Initialize fingerprint
		(async () => {
			const fp = await FingerPrint.load();
			const result = await fp.get()
			setFingerPrint(result.visitorId)
		})();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (props.app.flags.editMode && localStorage.getItem(APP_CONTRIBUTOR_KEY) == null && !!!showContributionOverlay)
			setShowContributionOverlay(true)
	}, [props.app.flags.editMode, showContributionOverlay])

	function manageVersion() {
		// Set current version
		dispatch({ type: "SET_VERSION", payload: { version }})

		const lastVersion = localStorage.getItem("version")
		if (lastVersion == null)
			localStorage.setItem("version", version)
		// If last version doesn't equal the current version the assign the last version to state
		else if (version !== lastVersion) {
			if (incomingVersionIsNewer(lastVersion, "4.0.0")) {
				window.alert(`UPDATE!!!\nWelcome datalinks version 4.0.0\n\nThis version is a massive redesign of the whole site aiming to embrace the dark theme and reduce the vibrant colors but also the program flow and UX\n\nI want to address the chaos in this version to make it easier to find your content and easier to get an overview. I hope you find this update helpful`)
				localStorage.setItem("version", version)
				dispatch({ type: "SET_LAST_VERSION", payload: { version: lastVersion }})
			}
		}
	}
	
	// Render contribution form if contributor isn't set
	if (showContributionOverlay && props.app.flags.editMode)
		return <SubmitContributorName toggleView={setShowContributionOverlay} />

	// ? When no content is provided we don't show a site at all
	if (props.content.hasLoaded && props.content.activeProgramSubjects.length <= 0)
		return <NotFoundPage />

	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Home />
				</Route>
				<Route exact path="/:program">
					<Subscriptions />
					
					<Subjects 
						updateSubjects={fetchUpdatedSubjects}
					/>
				</Route>
				<Route exact path="/:program/contributors">
					<Contributors />
				</Route>
				<Route exact path="/:program/archive">
					<Archive subjects={props.content.activeProgramSubjects} />
				</Route>
				<Route exact path={`/:program/course/:subjectCode`}>
					<Subscriptions />
					<SubjectView
						updateSubjects={fetchUpdatedSubjects}
					/>
				</Route>
				{props.content.hasLoaded ? 
					<Route>
						<NotFoundPage />
					</Route> : null
				}
			</Switch>
		</Router>
	)
}

export interface PropsForComponent {
	app: IAppState
	content: IContentState
	enableEditMode: IEnableEditMode
	setExtendViewFlag: ISetExtendViewFlag
	setDeadlineViewFlag: ISetDeadlineViewFlag
	setReplaceCountdownWithDateFlag: ISetReplaceCountdownWithDateFlag
	setCompletedDeadlines: ISetCompletedDeadlines
	setContributor: ISetContributor
	setFingerPrint: ISetFingerPrint
}

const reduxSelect = (state: IReduxRootState) => ({
	app: state.app,
	content: state.content
})

const reduxDispatch = () => ({
	enableEditMode,
	setExtendViewFlag,
	setDeadlineViewFlag,
	setReplaceCountdownWithDateFlag,
	setCompletedDeadlines,
	setContributor,
	setFingerPrint
})

export default connect(reduxSelect, reduxDispatch())(App);
