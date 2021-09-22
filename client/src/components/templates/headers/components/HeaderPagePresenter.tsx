import React from 'react'
import "./HeaderPagePresenter.css"

export default function HeaderPagePresenter(props: PropsForComponent) {
    return (
        <div className="header-page-presenter-container">
            { // TODO This is a quick fix, do not display program when in contribution page (since this is not actually specific to the program but to the site)
            props.pagePresenter === "Contributors" ?
                <h2 className="header-page-presenter-primary">DataLinks</h2> :
                <h2 className="header-page-presenter-primary">{props.program}'s</h2>
            }
            <h3 className="header-page-presenter-secondary">{props.pagePresenter}</h3>
        </div>
    )
}

interface PropsForComponent {
    program: string
    pagePresenter: string
}
