import React, { Component } from 'react'
import { subjects } from "../../../assets/data.json"
import SubjectComponent from "./components/Subject"
import { v4 as uuid } from "uuid"
import "./Subjects.css"

export class Subjects extends Component {
	render() {
		return (
			<section className="Master">
				<div>
					<h1 className="Title">Subjects</h1>
				</div>
				<div className="SubjectContainer">
					{
						subjects.map((subject) =>
							<SubjectComponent
								key={uuid()}
								subject={subject}
							/>
						)
					}
				</div>
			</section>
		)
	}
}

export default Subjects
