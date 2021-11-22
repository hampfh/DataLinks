import Moment from "moment"
import { useSelector } from "react-redux"
import { IReduxRootState } from "state/reducers"
import {  IAuthState } from "state/reducers/app"
import "./Contributor.css"

export default function Contributor({ contributor, place }: PropsForComponent) {

	const authSession = useSelector<IReduxRootState, IAuthState | undefined>(state => state.app.auth)

	function displayDate() {
		// Is the edit today?
		
		const editDate = Moment(contributor.updatedAt)
		if (editDate.diff(Moment().startOf("day")) > 0)
			return "Today " + editDate.format("HH:mm")
		else if (editDate.diff(Moment().subtract(1, "day").startOf("day")) > 0)
			return "Yesterday " + editDate.format("HH:mm")
		else
			return editDate.format("HH:mm DD/MM")
	}

	const totalEdits = contributor.contributions.operations.creates + 
		contributor.contributions.operations.updates + 
		contributor.contributions.operations.deletes
	const containerWidth = 150

	const createsWidth = containerWidth * (contributor.contributions.operations.creates / totalEdits)
	const updatesWidth = containerWidth * (contributor.contributions.operations.updates / totalEdits)
	const deletesWidth = containerWidth * (contributor.contributions.operations.deletes / totalEdits)

	return (
		<div className="contributorElementWrapper">
			<div className="contributor">
				<p className={`name`}>
					{place}. <span>{contributor.name ?? "Anonymous"}</span>
					{contributor.identifier.findIndex((current) => current === authSession?.kthId) >= 0 ?
						<span className="contributor-is-self">You</span> : null
					}
				</p>
				<p className="score">{contributor.contributionCount}</p>
				<p title="Last contribution" className="date">{displayDate()}</p>
			</div>
			<div className="editSummeryBar">
				{createsWidth > 0 &&
					<div 
						title={`${contributor.contributions.operations.creates} creates`}
						className="creates segment" style={{ width: createsWidth }} 
					/>
				}
				{updatesWidth > 0 &&
					<div
						title={`${contributor.contributions.operations.updates} updates`} 
						className="updates segment" style={{ width: updatesWidth }} 
					/>
				}
				{deletesWidth > 0 &&
					<div
						title={`${contributor.contributions.operations.deletes} deletes`} 
						className="deletes segment" style={{ width: deletesWidth }} 
					/>
				}
			</div>
		</div>
	)
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
}
