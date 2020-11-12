import React, { Component } from 'react'
import Contributor, { IContributor } from './components/Contributor'
import Http from 'functions/HttpRequest'
import "./Contributors.css"

export default class Contributors extends Component<{}, StateForComponent> {

	constructor(props: {}) {
		super(props)

		this.state = {
			contributors: []
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

	render() {
		return (
			<section className="contributorsWrapper">
				<div className="contributorsContainer">
					<h1>Top contributors</h1>
					<section className="contributorList">
						<div className="contributor">
							<h3 className="name">Name</h3>
							<h3 className="score">Contributions</h3>
							<h3 className="date">Last edit</h3>
						</div>
						{this.state.contributors.map((contributor) => <Contributor key={contributor.identifier} contributor={contributor} />)}
					</section>
				</div>
			</section>
		)
	}
}


interface StateForComponent {
	contributors: IContributor[]
}