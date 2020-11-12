import React, { Component } from 'react'
import Moment from "moment"
import "./Contributor.css"

export default class Contributor extends Component<PropsForComponent> {

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
		return (
			<div className="contributor">
				<p className="name">{this.props.place}. <span>{this.props.contributor.name}</span></p>
				<p className="score">{this.props.contributor.contributionCount} edits</p>
				<p className="date">{this.displayDate()}</p>
			</div>
		)
	}
}

export interface IContributor {
	name: string,
	contributionCount: number,
	identifier: string,
	updatedAt: string
}

interface PropsForComponent {
	place: number,
	contributor: IContributor
}