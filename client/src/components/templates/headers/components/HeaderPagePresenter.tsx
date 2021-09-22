import React from 'react'
import "./HeaderPagePresenter.css"

export default function HeaderPagePresenter(props: PropsForComponent) {
    return (
        <div className="header-page-presenter-container">
            <h2 className="header-page-presenter-primary">{props.program}'s</h2>
            <h3 className="header-page-presenter-secondary">{props.pagePresenter}</h3>
        </div>
    )
}

interface PropsForComponent {
    program: string
    pagePresenter: string
}
