import React from 'react'
import HeaderMenu from './components/HeaderMenu'
import HeaderPagePresenter from './components/HeaderPagePresenter'
import { version } from "../../../../package.json"

import "./DefaultHeader.css"
import { useSelector } from 'react-redux'
import { IReduxRootState } from 'state/reducers'
import { IAuthState } from 'state/reducers/app'

export default function DefaultHeader(props: PropsForComponent) {

    const auth = useSelector<IReduxRootState, IAuthState | undefined>(state => state.app.auth)

    return (
        <div className="default-header-container">
            <div className="default-header-page-presenter-container">
                <HeaderPagePresenter program={props.program} pagePresenter={props.pagePresenter} />
            </div>
            <div className="default-header-menu">
                <div className="default-header-menu-top">
                    {
                        auth &&
                        <div className="default-header-menu-top-auth-container">
                            <p className="default-header-logged-in-text">Logged in as: {auth.kthId} </p>
                            <a href="/logout"><p className="default-header-logged-in-text default-header-logged-in-logout-link">Logout</p></a>
                        </div>
                    }
                </div>
                <div className="default-header-menu-body">
                    <HeaderMenu program={props.program} selected={props.menuSelect} />
                </div>
            </div>
            <div className="default-header-version-container">
                <p className="default-header-version-number">v{version}</p>
            </div>
        </div>
    )
}

interface PropsForComponent {
    program: string
    menuSelect: number
    pagePresenter: string
}