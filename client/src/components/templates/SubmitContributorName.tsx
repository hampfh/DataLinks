import React, { Component } from 'react'
import Http from "functions/HttpRequest"
import { connect } from "react-redux"
import { IReduxRootState } from 'state/reducers'
import { IAddContributor, addContributor } from 'state/actions/app'
import { IAppState } from 'state/reducers/app'
import "./SubmitContributorName.css"

class SubmitContributorName extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			nameInput: ""
		}
	}

	inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let newState = { ...this.state }
		newState.nameInput = event.target.value
		this.setState(newState)
	}

	submitName = async () => {
		if (this.state.nameInput.length > 0) {
			await Http({
				url: "/api/v1/contributor/name",
				method: "POST",
				data: {
					name: this.state.nameInput,
					fingerprint: this.props.app.fingerprint
				}
			})
		}

		this.props.addContributor(this.state.nameInput)
		this.props.toggleView(false)
	}

	render() {
		return (
			<div className="contributorOverlayWrapper">
				<div className="contributorContentContainer">
					<h3>Contributor</h3>
					<p>Hi! Thank you for contributing to DataLinks. As a contributor, all your changes are associated with you and for each edit you increase your contribution score. Enter your preferred display name as a contributor (leave empty for anonymous)</p>
					<p>Note that a contributor is related to the browser, if you change device and/or browser you're considered another contributor</p>
					<div className="contributorInteractive">
						<input onChange={this.inputChange} placeholder="Display name" />
						<button onClick={this.submitName}>Submit name</button>
					</div>
				</div>
			</div>
		)
	}
}

interface PropsForComponent {
	app: IAppState,
	toggleView: (on: boolean) => void,
	addContributor: IAddContributor
}

interface StateForComponent {
	nameInput: string
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		app: state.app
	}
}

const reduxDispatch = () => {
	return {
		addContributor
	}
}

export default connect(reduxSelect, reduxDispatch())(SubmitContributorName)

