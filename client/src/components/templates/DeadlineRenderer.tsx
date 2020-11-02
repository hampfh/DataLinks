import React, { Component } from 'react'
import ContentObject from '../screens/Subject/components/ContentObject';
import { SubjectData } from '../screens/Subjects/Subjects';
import { Group, IDeadline } from './RenderData'
import "./DeadlineRenderer.css"

export default class DeadlineRenderer extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		let deadlines: IDeadline[] | undefined = undefined
		if (this.props.subjects)
			deadlines = this.compileDeadlines()

		this.state = {
			deadlines: deadlines ?? []
		}
	}

	componentDidUpdate() {
		let newState = { ...this.state }
		newState.deadlines = this.compileDeadlines()
		if (newState.deadlines.length === this.state.deadlines.length)
			return

		if (newState.deadlines.length > 0)
			this.setState(newState)
	}

	compileDeadlines(): IDeadline[] {
		let deadlines: IDeadline[] = []
		// Itterate through all subjects
		for (let i = 0; i < this.props.subjects.length; i++) {
			let strippedDeadlines = this.recursiveCompilation(this.props.subjects[i].group)
			if (deadlines.length <= 0)
				deadlines = strippedDeadlines
			else
				deadlines.concat(strippedDeadlines)
		}
		return deadlines
	}

	recursiveCompilation(group: Group, depth?: number): IDeadline[] {
		if (group == null || (depth !== undefined && depth > 5)) 
			return []

		let content: IDeadline[] = []
		for (let i = 0; i < group.content.length; i++) {
			if (group.content[i].group != null) {
				let response = this.recursiveCompilation(group.content[i].group as Group, depth === undefined ? 1 : depth + 1)
				if (content.length <= 0)
					content = response
				else
					content.concat(response)
			} else if (group.content[i].deadline?.deadline != null)
				content.push(group.content[i].deadline as IDeadline)
		}
		return content
	}

	render() {
		if (this.state.deadlines.length <= 0)
			return null
		return (
			<div className="deadlineRendererContainer">
				<h3 className="deadlineWrapperTitle">Deadlines</h3>
				<div className="deadlineWrapper">
					{this.state.deadlines.map((deadline) => <ContentObject
						key={deadline._id + "_NOEDIT"}
						type="Deadline"
						parentId={"0"}
						id={deadline._id}
						contentObject={deadline}
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
}

interface StateForComponent {
	deadlines: IDeadline[]
}