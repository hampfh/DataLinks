import React from 'react'
import HeaderMenu from './components/HeaderMenu'
import HeaderPagePresenter from './components/HeaderPagePresenter'
import { version } from "../../../../package.json"

import "./DefaultHeader.css"

export default function DefaultHeader(props: PropsForComponent) {
    return (
        <div className="default-header-container">
            <div className="default-header-page-presenter-container">
                <HeaderPagePresenter pagePresenter={props.pagePresenter} />
            </div>
            <div className="default-header-menu">
                <HeaderMenu selected={props.menuSelect} />
            </div>
            <div className="default-header-version-container">
                <p className="default-header-version-number">v{version}</p>
            </div>
        </div>
    )
}

interface PropsForComponent {
    menuSelect: number
    pagePresenter: string
}