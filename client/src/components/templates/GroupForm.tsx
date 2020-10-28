import React, { Component } from 'react'

export default class GroupForm extends Component<PropsForComponent, StateForComponent> {

	constructor(props: PropsForComponent) {
		super(props)

		this.state = {
			name: ""
		}
	}

	_onGroupNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let newState = { ...this.state }
		newState.name = event.target.value
		this.setState(newState)
	}

	render() {
		if (!!!this.props.editMode)
			return null

		// Only render form if on the correct level
		else if (this.props.newGroup != null && ((this.props.forRoot && this.props.parentId == null) || this.props.newGroup?.parentGroup.toString() === this.props.parentId?.toString())) {
			return (
				<div>
					<input onChange={(event) => this._onGroupNameChange(event)} placeholder="Group name" value={this.state.name ?? ""} />
					<button onClick={() => this.props.submitGroup(this.state.name)}>Create group</button>
				</div>
			)
		}
		// Render Add group button
		else
			return (<button onClick={() => this.props.createGroup(this.props.parentId ?? this.props.parentId, true)}>Add group</button>)	
	}
}

interface PropsForComponent {
	forRoot: boolean,
	editMode: boolean,
	parentId: string,
	newGroup?: {
		name: string,
		parentGroup: string,
		isSubGroup: boolean
	},
	createGroup: (id: string, isSubGroup: boolean) => Promise<void>,
	submitGroup: (name: string) => Promise<void>
}

interface StateForComponent {
	name: string
}