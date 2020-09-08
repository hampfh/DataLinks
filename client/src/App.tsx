import React from 'react';
import Subjects from "./components/screens/Subjects/Subjects"
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Component } from 'react';
import { SubjectData } from "./components/screens/Subjects/Subjects"
import Http, { HttpReturnType } from "./functions/HttpRequest"
import SubjectView from "./components/screens/Subject/SubjectView"
import { v4 as uuid } from "uuid"

class App extends Component<{}, StateForComponent> {

	constructor(props: {}) {
		super(props)
		this.state = {
			data: {
				title: "",
				subjects: []
			}
		}
	}

	async componentDidMount() {
		const response = (await Http({
			url: "/data",
			method: "GET",
			body: {

			}
		})) as HttpReturnType & {
			data: {
				title: string,
				subjects: Array<SubjectData>
			}
		}

		const newState = { ...this.state }
		newState.data = response.data
		this.setState(newState)
	}
	
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/">
						<Subjects data={this.state.data} />
					</Route>
					{this.state.data.subjects.map((subject) => {
						return (
							<Route key={uuid()} exact path={`/course/${subject.title}`}>
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
	data: {
		title: string,
		subjects: Array<SubjectData>
	}
}

export default App;
