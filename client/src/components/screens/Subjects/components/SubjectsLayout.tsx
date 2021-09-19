import React from 'react'
import { SubjectData } from "components/screens/Subjects/Subjects"
import "./SubjectsLayout.css"
import SubjectItem from './SubjectItem'
import SubjectSneakPeak from "components/screens/Subjects/components/SneakPeak"
import { connect } from "react-redux"
import { IReduxRootState } from 'state/reducers'
import DeadlineColumn from './DeadlineColumn'

function SubjectsLayout(props: PropsForComponent) {
    return (
        <div className="subjects-layout-container">
            <div className="subjects-layout-grid-container">
                <div className="subjects-layout-preview-box">
                    <div className="subjects-layout-box-container-intro">
                        <h3 className="subjects-layout-box-container-preview-title">Course preview</h3>
                        <h2 className="subject-code-sneakpeak-mobile-title">{props.sneakPeak?.code}</h2>
                    </div>
                    <div className="default-box-container subjects-layout-box-container subjects-layout-box-container-course">
                        {props.sneakPeak == null ?
                            <div className="empty-preview-box-title-container">
                                <p className="empty-preview-box-title">Hover over a course to preview it here</p>
                            </div> :
                            <SubjectSneakPeak
                                sneakPeakSubject={props.sneakPeak}
                                updateSubjects={props.updateSubjects}
                            />
                        }
                    </div>
                </div>
                <div className="subjects-layout-courses-box">
                    <div className="subjects-layout-box-container-intro">
                        <h3>Courses</h3>
                    </div>
                    <div className="default-box-container subjects-layout-box-container subjects-layout-box-container-courses">
                        <div className="subjects-layout-box-container-courses-container">
                            {props.subjects.map(current => !current.archived && <SubjectItem key={current._id} subject={current} updateSubjects={props.updateSubjects} />)}
                        </div>
                    </div>
                </div>
                <div className="subjects-layout-deadline-box">
                    <div className="subjects-layout-box-container-intro">
                        <h3>Deadlines</h3>
                    </div>
                    <div className="default-box-container subjects-layout-box-container">
                        <DeadlineColumn subjects={props.subjects} />
                    </div>
                </div>
            </div>
        </div>
    )
}

interface PropsForComponent {
    subjects: SubjectData[]
    sneakPeak?: SubjectData
    updateSubjects: () => void
}

const reduxSelect = (state: IReduxRootState) => ({
    sneakPeak: state.app.sneakPeak
})

export default connect(reduxSelect)(SubjectsLayout)