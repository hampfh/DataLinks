import React from 'react';
import Subjects from "./components/screens/Subjects/Subjects"
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Component } from 'react';
import { SubjectData } from "./components/screens/Subjects/Subjects"
import Http, { HttpReturnType } from "./functions/HttpRequest"
import SubjectView from "./components/screens/Subject/SubjectView"
import { v4 as uuid } from "uuid"

export interface AddedElement {
	parentId: string,
	fieldOne: string,
	fieldTwo: string,
	type: ContentType
}

export type ContentType = "Text" | "Link"

class App extends Component<{}, StateForComponent> {

	constructor(props: {}) {
		super(props)
		this.state = {
			subjects: [],
			editMode: false,
			deleted: [],
			added: []
		}
	}

	componentDidMount() {
		this._updateSubjects()
	}

	_addContent = (parentId: string, fieldOne: string, fieldTwo: string, type: ContentType) => {
		let newState = { ...this.state }
		newState.added.push({
			parentId,
			fieldOne,
			fieldTwo,
			type
		})
		this.setState(newState)
	}

	_addDeletedContent = (id: string) => {
		let newState = { ...this.state }
		newState.deleted.push(id)
		this.setState(newState)
	}

	_setEditMode = (mode: boolean) => {
		const newState = { ...this.state }
		newState.editMode = mode
		this.setState(newState)
	}

	_updateSubjects = async () => {
		const response = (await Http({
			url: "/api/v1/subject",
			method: "GET",
			body: {

			}
		})) as HttpReturnType & {
			result: Array<SubjectData>
		}

		const newState = { ...this.state }
		newState.subjects = response.result
		this.setState(newState)
	}
	
	render() {
		if (this.state.subjects === undefined)
			return null
		return (
			<Router>
				<Switch>
					<Route exact path="/">
						<Redirect to="/D20"/>
					</Route>
					<Route exact path="/D20">
						<Subjects 
							subjects={this.state.subjects} 
							editMode={this.state.editMode} 
							setEditMode={this._setEditMode} 
							updateSubjects={this._updateSubjects}
							deleted={this.state.deleted}
							added={this.state.added}
							addDeleted={this._addDeletedContent}
							addContent={this._addContent}
						/>
					</Route>
					{this.state.subjects.map((subject) => {
						return (
							<Route key={uuid()} exact path={`/D20/course/${subject.name}`}>
								<SubjectView
									updateSubjects={this._updateSubjects}
									editMode={this.state.editMode}
									subject={subject}
									close={() => { }}
									deleted={this.state.deleted}
									added={this.state.added}
									addDeleted={this._addDeletedContent}
									addContent={this._addContent}
								/>
							</Route>
						)
					})}
				</Switch>
			</Router>
		);
	}
}

export interface StateForComponent {
	subjects: SubjectData[],
	editMode: boolean,
	deleted: string[],
	added: AddedElement[]
}

export default App;
