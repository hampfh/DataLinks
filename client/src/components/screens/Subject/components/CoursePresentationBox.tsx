import React from 'react'
import "./CoursePresentationBox.css"

export default function CoursePresentationBox(props: PropsForComponent) {
    return (
        <div className="default-box-container course-presentation-box-container">
            <h1 className="course-presentation-box-title">{props.courseName}</h1>
            <h2 className="course-presentation-box-coursecode">{props.courseCode}</h2>
            <div className="course-presentation-box-separator" />
            <p className="course-presentation-box-coursedescription">{props.courseDescription}</p>
        </div>
    )
}

interface PropsForComponent {
    courseName: string
    courseCode: string
    courseDescription: string
}
