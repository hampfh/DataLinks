import { Component } from 'react'
import Moment from "moment"
import "./Contributor.css"
import { IReduxRootState } from 'state/reducers'
import { connect } from "react-redux"

class Contributor extends Component<PropsForComponent> {

	displayDate() {
		// Is the edit today?
		
		const editDate = Moment(this.props.contributor.updatedAt)
		if (editDate.diff(Moment().startOf("day")) > 0)
			return "Today " + editDate.format("HH:mm")
		else if (editDate.diff(Moment().subtract(1, "day").startOf("day")) > 0)
			return "Yesterday " + editDate.format("HH:mm")
		else
			return editDate.format("HH:mm DD/MM")
	}

	render() {
		const totalEdits = this.props.contributor.contributions.operations.creates + 
			this.props.contributor.contributions.operations.updates + 
			this.props.contributor.contributions.operations.deletes
		const containerWidth = 150		

		const createsWidth = containerWidth * (this.props.contributor.contributions.operations.creates / totalEdits)
		const updatesWidth = containerWidth * (this.props.contributor.contributions.operations.updates / totalEdits)
		const deletesWidth = containerWidth * (this.props.contributor.contributions.operations.deletes / totalEdits)

		return (
			<div className="contributorElementWrapper">
				<div className="contributor">
					<p className={`name`}>
						{this.props.place}. <span>{this.props.contributor.name ?? "Anonymous"}</span>
						{this.props.contributor.identifier.findIndex((current) => current === this.props.fingerprint) >= 0 ?
							<span className="contributor-is-self">You</span> : null
						}
					</p>
					<p className="score">{this.props.contributor.contributionCount}</p>
					<p title="Last contribution" className="date">{this.displayDate()}</p>
				</div>
				<div className="editSummeryBar">
					{createsWidth > 0 &&
						<div 
							title={`${this.props.contributor.contributions.operations.creates} creates`}
							className="creates segment" style={{ width: createsWidth }} 
						/>
					}
					{updatesWidth > 0 &&
						<div
							title={`${this.props.contributor.contributions.operations.updates} updates`} 
							className="updates segment" style={{ width: updatesWidth }} 
						/>
					}
					{deletesWidth > 0 &&
						<div
							title={`${this.props.contributor.contributions.operations.deletes} deletes`} 
							className="deletes segment" style={{ width: deletesWidth }} 
						/>
					}
				</div>
			</div>
		)
	}
}

export interface IContributor {
	name?: string,
	contributions: {
		operations: {
			creates: number,
			updates: number,
			deletes: number
		},
	},
	contributionCount: number,
	identifier: string[],
	updatedAt: string
}

interface PropsForComponent {
	place: number,
	contributor: IContributor,
	fingerprint?: string
}

const reduxSelect = (state: IReduxRootState) => ({
	fingerprint: state.app.fingerprint
})

export default connect(reduxSelect)(Contributor)