import { useEffect, useState } from 'react'
import Contributor, { IContributor } from './components/Contributor'
import Http from 'functions/HttpRequest'
import "./Contributors.css"
import SocketManager from 'components/utilities/SocketManager'
import { OperationType } from 'App'
import Moment from "moment"
import logoutIcon from "assets/icons/close.svg"
import { Link, useParams } from 'react-router-dom'
import { ContentType } from 'components/utilities/contentTypes'
import { connect } from 'react-redux'
import { IReduxRootState } from 'state/reducers'
import { IAppState } from 'state/reducers/app'
import { DataLoader } from 'functions/DataLoader'

interface INewContribution {
	name?: string,
	identifier: string,
	operation: OperationType, // This should have a correct OperationType from backend
	type: ContentType // Should have correct ContentType from
}

function Contributors(props: PropsForComponent) {

	const [contributors, setContributors] = useState<IContributor[]>([])
	const { program: programName } = useParams<IRouterParams>()

	useEffect(() => {
		DataLoader.manageProgramContentData(programName).then(async () => {
			const program = DataLoader.getActiveProgram()
			if (program == null) 
				return

				const response = await Http({
					url: "/api/v1/contributors",
					method: "GET",
					data: {
						program: program.id
					}
				})

				setContributors(response.contributors)
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

	return (
		<>
			<SocketManager subscribeTo="contribution" callback={_onContribution} />
			<section className="contributorsWrapper">
				<div className="contributorsContainer">
					<Link to={`/${DataLoader.getActiveProgram()?.name ?? 404}`}>
						<img className="logoutIcon" alt="Exit view" src={logoutIcon} />
					</Link>
					<h1>Top contributors</h1>
					<section className="contributorList">
						<div className="contributor header">
							<h3 className="name">Name</h3>
							<h3 className="score">Contributions</h3>
							<h3 className="date">Last edit</h3>
						</div>
						{contributors.map((contributor, index) => 
							// Only show contributor if it is yourself OR you have more than 0 contributions
							(contributor.contributionCount > 0 || contributor.identifier.findIndex((current) => current === props.app.fingerprint) >= 0) &&
								<Contributor key={contributor.identifier[0]} place={index + 1} contributor={contributor} />
							)
						}
					</section>
				</div>
			</section>
		</>
	)
}

interface PropsForComponent {
	app: IAppState
}

const reduxSelect = (state: IReduxRootState) => ({
	app: state.app
})

export default connect(reduxSelect)(Contributors)