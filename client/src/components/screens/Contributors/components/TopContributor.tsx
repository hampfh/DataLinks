import moment from 'moment'
import React from 'react'
import { IContributor } from './Contributor'
import "./TopContributor.css"

export default function TopContributor(props: PropsForComponent) {

    const containerWidth = 300		

    const createsWidth = containerWidth * (props.contributor.contributions.operations.creates / props.contributor.contributionCount)
    const updatesWidth = containerWidth * (props.contributor.contributions.operations.updates / props.contributor.contributionCount)
    const deletesWidth = containerWidth * (props.contributor.contributions.operations.deletes / props.contributor.contributionCount)

    return (
        <div className="top-contributor-container">
            <h4 className="top-contributor-name">#{props.place} {props.contributor.name ?? "Anonymous"}</h4>
            <p 
                title="Last contribution" 
                className="top-contributor-updated-at-text">
                {
                    moment(props.contributor.updatedAt).diff(moment(), "days") > 365 ? moment(props.contributor.updatedAt).format("HH:mm D/M/YYYY") : moment(props.contributor.updatedAt).format("HH:mm D/M")
                }
            </p>
            <div className="editSummeryBar">
                {createsWidth > 0 &&
                    <div 
                        title={`${props.contributor.contributions.operations.creates} creates`}
                        className="creates segment" 
                        style={{ width: createsWidth }} 
                    />
                }
                {updatesWidth > 0 &&
                    <div 
                        title={`${props.contributor.contributions.operations.updates} updates`}
                        className="updates segment" 
                        style={{ width: updatesWidth }} 
                    />
                }
                {deletesWidth > 0 &&
                    <div 
                        title={`${props.contributor.contributions.operations.deletes} deletes`}
                        className="deletes segment" 
                        style={{ width: deletesWidth }} 
                    />
                }
            </div>
            <p className="top-contributor-contribution-count-text">{props.contributor.contributionCount}</p>
        </div>
    )
}

interface PropsForComponent {
	place: number,
	contributor: IContributor,
	fingerprint?: string
}
