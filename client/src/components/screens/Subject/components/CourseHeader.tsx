import { DataLoader } from 'functions/DataLoader'
import isMobile from 'functions/isMobile'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { disableEditModeFlag, enableEditMode, IDisableEditModeFlag, IEnableEditMode } from 'state/actions/app'
import { IReduxRootState } from 'state/reducers'
import { ReactComponent as BackButton } from "assets/svgs/illustrations/Backbutton.svg"
import "./CourseHeader.css"

function CourseHeader(props: PropsForComponent) {

    const [editModeSwitchActive, setEditModeSwitchActive] = useState<boolean | undefined>(undefined)

    function _flickEditMode(event: React.ChangeEvent<HTMLInputElement>) {

		const checked = event.target.checked

		setEditModeSwitchActive(!props.editMode)

		if (checked)
			props.enableEditMode()
		else
			props.disableEditModeFlag()
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
						<p>Default mode</p>
						<label className="course-header-edit-mode-switch switch">
							<input onChange={(event) => _flickEditMode(event)} checked={editModeSwitchActive && props.editMode} type="checkbox" />
							<span className="slider round"></span>
						</label>
						<p>Edit mode</p>
					</div>
				}
        </div>
    )
}

interface PropsForComponent {
    isArchived: boolean
    editMode: boolean
    enableEditMode: IEnableEditMode
	disableEditModeFlag: IDisableEditModeFlag
}

const reduxSelect = (state: IReduxRootState) => ({
	content: state.content,
	editMode: state.app.flags.editMode
})

const reduxDispatch = () => ({
	enableEditMode,
	disableEditModeFlag
})

export default connect(reduxSelect, reduxDispatch())(CourseHeader)