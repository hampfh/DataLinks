import React, { Component } from 'react'
import Contributor, { IContributor } from './components/Contributor'
import Http from 'functions/HttpRequest'
import "./Contributors.css"
import SocketManager from 'components/utilities/SocketManager'
import { ContentType } from 'App'
import Moment from "moment"
import logoutIcon from "assets/icons/close.svg"
import { Redirect } from 'react-router-dom'

interface INewContribution {
	name?: string,
	identifier: string,
	operation: string, // This should have a correct OperationType from backend
	type: ContentType // Should have correct ContentType from
}

export default class Contributors extends Component<{}, StateForComponent> {

	constructor(props: {}) {
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
		const newState = { ...this.state }
		const contributor = newState.contributors.find((contributor) => contributor.identifier === data.identifier)
		if (contributor == null) {
			// Create new local contributor
			newState.contributors.push({
				name: data.name,
				contributionCount: 1,
				identifier: data.identifier,
				updatedAt: Moment().toString()
			})
		} else {
			if (contributor.name == null && data.name != null)
				contributor.name = data.name
			contributor.updatedAt = Moment().toString()
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
					<img className="logoutIcon" alt="Exit view" onClick={this._onExitView} src={logoutIcon} />
					<div className="contributorsContainer">
						<h1>Top contributors</h1>
						<section className="contributorList">
							<div className="contributor">
								<h3 className="name">Name</h3>
								<h3 className="score">Contributions</h3>
								<h3 className="date">Last edit</h3>
							</div>
							{this.state.contributors.map((contributor, index) => <Contributor key={contributor.identifier} place={index + 1} contributor={contributor} />)}
						</section>
					</div>
				</section>
			</>
		)
	}
}


interface StateForComponent {
	contributors: IContributor[],
	shouldExitView: boolean
}