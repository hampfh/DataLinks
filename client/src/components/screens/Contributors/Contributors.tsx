import { useEffect, useState } from 'react'
import Contributor, { IContributor } from './components/Contributor'
import Http from 'functions/HttpRequest'
import "./Contributors.css"
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { IReduxRootState } from 'state/reducers'
import { IAppState } from 'state/reducers/app'
import { DataLoader } from 'functions/DataLoader'
import NotFoundPage from "components/screens/404/404"
import { IContentState } from 'state/reducers/content'
import DefaultHeader from 'components/templates/headers/DefaultHeader'
import TopContributor from './components/TopContributor'

function Contributors(props: PropsForComponent) {

	const [contributors, setContributors] = useState<IContributor[]>([])
	const { program: programName } = useParams<IRouterParams>()

	const [hasLoaded, setHasLoaded] = useState(false)

	useEffect(() => {
		DataLoader.manageProgramContentData(programName).then(async ({ program }) => {
			if (program == null) 
				return

				const response = await Http({
					url: "/api/v1/contributors",
					method: "GET"
				})

				if (response.status === 200)
					setContributors(response.contributors)
				setHasLoaded(true)
				
				if (window.localStorage.getItem("new-login-migration-reminder") == null && window.confirm("DataLinks has a new login system using KTH's login service, if you want to keep your old data dm me on discord (Chain#4341) with your old name and your kthId. \nYou must have logged in at least once with the new system before doing this")) {
					window.localStorage.setItem("new-login-migration-reminder", "true")
				}
			}
		)
	}, [programName])

	if (props.content.hasLoaded && programName == null)
		return <NotFoundPage />

	const [ first, second, third, ...otherContributors ] = contributors

	return (
		<div>
			<DefaultHeader program={programName} menuSelect={2} pagePresenter="Contributors" />
			{props.content.hasLoaded && hasLoaded &&
				<div className="contributors-content-container">
					<h1 className="contributors-title">Top contributors</h1>
					<div className="contributors-top-contributors-container">
						{first &&
							<div className="contributors-top-contributor-container">
								<TopContributor place={1} contributor={first} />
							</div>
						}
						{second && 
							<div className="contributors-second-contributor-container">
								<TopContributor place={2} contributor={second} />
							</div>
						}
						{third &&
							<div className="contributors-third-contributor-container">
								<TopContributor place={3} contributor={third} />
							</div>
						}
					</div>
					<div className="contributors-rest-container">
						{
							otherContributors.map((current, index) => <Contributor key={current.kthId} place={index + 4} contributor={current} />)
						}
					</div>
				</div>
			}
		</div>
	)
}

interface PropsForComponent {
	app: IAppState
	content: IContentState
}

const reduxSelect = (state: IReduxRootState) => ({
	app: state.app,
	content: state.content
})

export default connect(reduxSelect)(Contributors)