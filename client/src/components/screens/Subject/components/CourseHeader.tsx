import { DataLoader } from 'functions/DataLoader'
import isMobile from 'functions/isMobile'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { disableEditModeFlag, enableEditMode } from 'state/actions/app'
import { IReduxRootState } from 'state/reducers'
import { ReactComponent as BackButton } from "assets/svgs/illustrations/Backbutton.svg"
import "./CourseHeader.css"
import { IAuthState } from 'state/reducers/app'

export default function CourseHeader(props: PropsForComponent) {

	const dispatch = useDispatch()
	const location = useLocation()

	const editMode = useSelector<IReduxRootState, boolean>(state => state.app.flags.editMode)
	const auth = useSelector<IReduxRootState, IAuthState | undefined>(state => state.app.auth)

    function _flickEditMode(event: React.ChangeEvent<HTMLInputElement>) {

		const checked = event.target.checked

		if (checked/*  && auth */)
			dispatch(enableEditMode())
		else
			dispatch(disableEditModeFlag())
	}

    return (
        <div className="course-header-container">
            <div className="course-header-backbutton">
                <Link to={`/${DataLoader.getActiveProgram()?.name}`}>
                    <BackButton />
                </Link>
            </div>
            {!isMobile() && !props.isArchived &&
					<div className="course-header-edit-mode-switch-container">
						{!auth && 
							<>
								<p>Default mode</p>
								<label className="course-header-edit-mode-switch switch">
									<input onChange={(event) => _flickEditMode(event)} checked={editMode} type="checkbox" />
									<span className="slider round"></span>
								</label>
								<p>Edit mode</p>
							</>
						}
						{!auth &&
							<a href={`/login?redirect=${location.pathname}`}><p className="default-header-logged-in-text default-header-logged-in-logout-link">Login to KTH to start editing</p></a>
						}
					</div>
			}
        </div>
    )
}

interface PropsForComponent {
    isArchived: boolean
}
