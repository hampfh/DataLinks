import React from 'react';
import Subjects from "./components/screens/Subjects/Subjects"
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Component } from 'react';
import { SubjectData } from "./components/screens/Subjects/Subjects"
import Http, { HttpReturnType } from "./functions/HttpRequest"
import SubjectView from "./components/screens/Subject/SubjectView"
import { v4 as uuid } from "uuid"

class App extends Component<{}, StateForComponent> {

	constructor(props: {}) {
		super(props)
		this.state = {
			subjects: []
		}
	}

	async componentDidMount() {
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
		console.log(response.result)
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
						<Subjects subjects={this.state.subjects} />
					</Route>
					{this.state.subjects.map((subject) => {
						return (
							<Route key={uuid()} exact path={`/D20/course/${subject.name}`}>
								<SubjectView
									subject={subject}
									close={() => { }}
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
	subjects: SubjectData[]
}

export default App;
