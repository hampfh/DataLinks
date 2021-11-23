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
							otherContributors.filter(current => current.contributionCount > 0).map((current, index) => <Contributor key={current.identifier[0]} place={index + 4} contributor={current} />)
						}
					</div>
					<div className="info-duplicates">
						<p>Do you have duplicates users?</p>
						<p>That's because one "user" is tailored to the browser, if you change browser you are technically a new user. If you want to merge two accounts you can do so by contacting me on discord: Chain#4341</p>
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