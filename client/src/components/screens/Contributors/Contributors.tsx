import React, { Component } from 'react'
import Contributor, { IContributor } from './components/Contributor'
import Http from 'functions/HttpRequest'
import "./Contributors.css"
import SocketManager from 'components/utilities/SocketManager'
import { OperationType } from 'App'
import Moment from "moment"
import logoutIcon from "assets/icons/close.svg"
import { Redirect } from 'react-router-dom'
import { ContentType } from 'components/utilities/contentTypes'
import { connect } from 'react-redux'
import { IReduxRootState } from 'state/reducers'
import { IAppState } from 'state/reducers/app'

interface INewContribution {
	name?: string,
	identifier: string,
	operation: OperationType, // This should have a correct OperationType from backend
	type: ContentType // Should have correct ContentType from
}

class Contributors extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			contributors: [],
			shouldExitView: false
		}
	}

	componentDidMount = async () => {
		const response = await Http({
			url: "/api/v1/contributors",
			method: "GET"
		})

		let newState = { ...this.state }
		newState.contributors = response.contributors
		this.setState(newState)
	}

	_onContribution = (data: INewContribution) => {

		const newState: StateForComponent = JSON.parse(JSON.stringify(this.state))
		const contributor = newState.contributors.find((contributor) => {
			const target = contributor.identifier.find((current) => current === data.identifier)
			return (target != null)
		})

		if (contributor == null) {
			// Create new local contributor
			newState.contributors.push({
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
		newState.contributors.sort((a, b) => b.contributionCount - a.contributionCount)
		this.setState(newState)
	}

	_onExitView = () => {
		let newState = { ...this.state }
		newState.shouldExitView = true
		this.setState(newState)
	}

	render() {
		if (this.state.shouldExitView)
			return <Redirect to="/" />
		return (
			<>
				<SocketManager subscribeTo="contribution" callback={this._onContribution} />
				<section className="contributorsWrapper">
					<div className="contributorsContainer">
						<img className="logoutIcon" alt="Exit view" onClick={this._onExitView} src={logoutIcon} />
						<h1>Top contributors</h1>
						<section className="contributorList">
							<div className="contributor header">
								<h3 className="name">Name</h3>
								<h3 className="score">Contributions</h3>
								<h3 className="date">Last edit</h3>
							</div>
							{this.state.contributors.map((contributor, index) => 
								// Only show contributor if it is yourself OR you have more than 0 contributions
								contributor.contributionCount > 0 || contributor.identifier.findIndex((current) => current === this.props.app.fingerprint) >= 0 ?
									<Contributor key={contributor.identifier[0]} place={index + 1} contributor={contributor} /> :
									null
								)
							}
						</section>
					</div>
				</section>
			</>
		)
	}
}

interface PropsForComponent {
	app: IAppState
}

interface StateForComponent {
	contributors: IContributor[],
	shouldExitView: boolean
}

const reduxSelect = (state: IReduxRootState) => ({
	app: state.app
})

export default connect(reduxSelect)(Contributors)