import React, { Component } from 'react'
import { connect } from 'react-redux'
import Moment from "moment"

import ContentObject from "components/templates/content_objects/ContentObject"
import { SubjectData } from "components/screens/Subjects/Subjects"
import "./DeadlineRenderer.css"
import { IReduxRootState } from "state/reducers"
import { IDimensionState } from "state/reducers/dimensions"
import { ContentType } from 'components/utilities/contentTypes'

/**
 * This is the deadline renderer for the homepage, 
 * listing all current deadlines
 */

class DeadlineRenderer extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		let deadlines: ContentObject[] | undefined = undefined
		if (this.props.subjects)
			deadlines = this.sortDeadlines(this.compileDeadlines())

		this.state = {
			deadlines: deadlines ?? []
		}
	}

	sortDeadlines(deadlines: ContentObject[]) {
		deadlines.sort((a, b) => {
			return Moment(a.deadline!.deadline).diff(b.deadline!.deadline, "second")
		})
		return deadlines
	}

	componentDidUpdate() {
		let newState = { ...this.state }
		newState.deadlines = this.sortDeadlines(this.compileDeadlines())
		if (newState.deadlines.length === this.state.deadlines.length)
			return

		if (newState.deadlines.length > 0)
			this.setState(newState)
	}

	compileDeadlines(): ContentObject[] {
		let deadlines: ContentObject[] = []
		// Itterate through all subjects
		for (let i = 0; i < this.props.subjects.length; i++) {
			let strippedDeadlines = this.recursiveCompilation(this.props.subjects[i].group)
			if (deadlines.length <= 0)
				deadlines = strippedDeadlines
			else
				deadlines = deadlines.concat(strippedDeadlines)	
		}
		return deadlines
	}

	recursiveCompilation(group: Group, depth?: number): ContentObject[] {
		if (group == null || (depth !== undefined && depth > 5))
			return []

		let content: ContentObject[] = []
		for (let i = 0; i < group.content.length; i++) {
			if (group.content[i].group != null) {
				let response = this.recursiveCompilation(group.content[i].group as Group, depth === undefined ? 1 : depth + 1)
				if (response.length > 0) {
					if (content.length <= 0)
						content = response
					else
						content = content.concat(response)
				}
			} else if (group.content[i].deadline?.deadline != null)
				content.push(group.content[i])
		}
		return content
	}

	render() {
		if (this.state.deadlines.length <= 0)
			return null
		return (
			<div className="deadlineRendererContainer"
				style={{
					height: this.props.dimensions.content.height
				}}
			>
				<h3 className="deadlineWrapperTitle">Deadlines</h3>
				<div className="deadlineWrapper">
					{this.state.deadlines.map((deadlineWrapper) => <ContentObject
						key={deadlineWrapper._id + "_NOEDIT"}
						type={ContentType.DEADLINE}
						parentId={"0"}
						id={deadlineWrapper._id}
						contentObject={deadlineWrapper.deadline!}
						noEditMode
						accent
					/>)}
				</div>
			</div>
		)
	}
}

interface PropsForComponent {
	subjects: SubjectData[],
	dimensions: IDimensionState,
}

interface StateForComponent {
	deadlines: ContentObject[]
}

const reduxSelect = (state: IReduxRootState) => {
	return {
		dimensions: state.dimensions
	}
}

export default connect(reduxSelect)(DeadlineRenderer)