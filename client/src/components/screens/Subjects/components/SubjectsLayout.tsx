import React from 'react'
import { SubjectData } from "components/screens/Subjects/Subjects"
import "./SubjectsLayout.css"
import SubjectItem from './SubjectItem'

export default function SubjectsLayout(props: PropsForComponent) {
    return (
        <div className="subjects-layout-container">
            <div className="subjects-layout-grid-container">
                <div className="subjects-layout-preview-box">
                    <div className="subjects-layout-box-container-intro">
                        <h3>Course preview</h3>
                    </div>
                    <div className="default-box-container subjects-layout-box-container subjects-layout-box-container-course">
                        <p>Hover over a course to preview it here</p>
                    </div>
                </div>
                <div className="subjects-layout-deadline-box">
                    <div className="subjects-layout-box-container-intro">
                        <h3>Deadlines</h3>
                    </div>
                    <div className="default-box-container subjects-layout-box-container"></div>
                </div>
                <div className="subjects-layout-courses-box">
                    <div className="subjects-layout-box-container-intro">
                        <h3>Courses</h3>
                    </div>
                    <div className="default-box-container subjects-layout-box-container subjects-layout-box-container-courses">
                        <div className="subjects-layout-box-container-courses-container">
                            {props.subjects.map(current => !current.archived && <SubjectItem subject={current} updateSubjects={props.updateSubjects} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface PropsForComponent {
    subjects: SubjectData[]
    updateSubjects: () => void
}