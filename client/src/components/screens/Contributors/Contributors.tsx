import { useEffect, useState } from 'react'
import Contributor, { IContributor } from './components/Contributor'
import Http from 'functions/HttpRequest'
import "./Contributors.css"
import SocketManager from 'components/utilities/SocketManager'
import { OperationType } from 'App'
import Moment from "moment"
import { useParams } from 'react-router-dom'
import { ContentType } from 'components/utilities/contentTypes'
import { connect } from 'react-redux'
import { IReduxRootState } from 'state/reducers'
import { IAppState } from 'state/reducers/app'
import { DataLoader } from 'functions/DataLoader'
import NotFoundPage from "components/screens/404/404"
import { IContentState } from 'state/reducers/content'
import DefaultHeader from 'components/templates/headers/DefaultHeader'
import TopContributor from './components/TopContributor'

interface INewContribution {
	name?: string,
	identifier: string,
	operation: OperationType, // This should have a correct OperationType from backend
	type: ContentType // Should have correct ContentType from
}

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

				console.log("GET CONTRIBUTORS")
				setContributors(response.contributors)
				setHasLoaded(true)
			}
		)
	}, [programName])

	function _onContribution(data: INewContribution) {

		const newContributors: IContributor[] = JSON.parse(JSON.stringify(contributors))
		const contributor = newContributors.find((contributor) => {
			const target = contributor.identifier.find((current) => current === data.identifier)
			return (target != null)
		})

		if (contributor == null) {
			// Create new local contributor
			newContributors.push({
				name: data.name,
				contributions: {
					operations: {
						creates: data.operation === "CREATE" ? 1 : 0,
						updates: data.operation === "UPDATE" ? 1 : 0,
						deletes: data.operation === "DELETE" ? 1 : 0
					},
				},
				contributionCount: 1,
				identifier: [data.identifier],
				updatedAt: Moment().toString()
			})
		} else {
			if (contributor.name == null && data.name != null)
				contributor.name = data.name
			contributor.updatedAt = Moment().toString()

			switch (data.operation) {
				case "CREATE":
					contributor.contributions.operations.creates++
					break;
				case "UPDATE":
					contributor.contributions.operations.updates++
					break;
				case "DELETE":
					contributor.contributions.operations.deletes++
					break;
				default:
					break;
			}

			contributor.contributionCount++
		}

		// Sort contributions
		newContributors.sort((a, b) => b.contributionCount - a.contributionCount)
		setContributors(newContributors)
	}

	if (props.content.hasLoaded && programName == null)
		return <NotFoundPage />

	const [ first, second, third, ...otherContributors ] = contributors

	return (
		<>
			{/* <SocketManager subscribeTo="contribution" callback={_onContribution} /> */}
			<div>
				<DefaultHeader menuSelect={1} pagePresenter="Contributors" />
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
								<div className="contributors-thrid-contributor-container">
									<TopContributor place={3} contributor={third} />
								</div>
							}
						</div>
						<div className="contributors-rest-container">
							{
								otherContributors.filter(current => current.contributionCount > 0).map((current, index) => <Contributor key={current.identifier[0]} place={index + 4} contributor={current} />)
							}
						</div>
					</div>
				}
			</div>
		</>
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