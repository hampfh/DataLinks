import React from 'react'
import HeaderMenu from './components/HeaderMenu'
import HeaderPagePresenter from './components/HeaderPagePresenter'
import { version } from "../../../../package.json"

import "./DefaultHeader.css"

export default function DefaultHeader() {
    return (
        <div className="default-header-container">
            <HeaderPagePresenter />
            <HeaderMenu selected={0} />
            <div className="default-header-version-container">
                <p className="default-header-version-number">v{version}</p>
            </div>
        </div>
    )
}
