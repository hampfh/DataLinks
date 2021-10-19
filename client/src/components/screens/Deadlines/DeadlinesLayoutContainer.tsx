import React, { useEffect, useState } from 'react'
import "./DeadlinesLayout.css"
import { useSelector } from 'react-redux'
import { IReduxRootState } from 'state/reducers'
import { IContentState } from 'state/reducers/content'
import { getDeadlines, sortDeadlines } from 'components/utilities/deadline_computations'
import { SubjectData } from '../Subjects/Subjects'
import ContentObject from 'components/templates/content_objects/ContentObject'
import { ContentType } from 'components/utilities/contentTypes'
import { IDeadlineState } from 'state/reducers/deadlines'
import { json_replacer, json_reviver } from 'functions/json_serialization'

const LOCALSTORAGE_PREFERENCES_KEY = "deadlines_preferences"
interface IDeadlinePreference {
    deselectedSubjects: Map<string, boolean>
    showCompletedDeadlines: boolean
}

export default function DeadlinesLayoutContainer() {
    
    const content = useSelector<IReduxRootState, IContentState>(state => state.content)
    const completedDeadlines = useSelector<IReduxRootState, IDeadlineState>(state => state.deadlines).completed

    const [completedDeadlinesVisible, setCompletedDeadlinesVisible] = useState(false)
    const [deadlines, setDeadlines] = useState<ContentObject[]>([])
    const [selectionActive, setSelectionActive] = useState(false)
    const [deselectedSubjects, setDeselectedSubjects] = useState<Map<string, boolean>>(new Map())


    // Load previous configuration if it exists
    useEffect(() => {
        const rawDeselects = localStorage.getItem(LOCALSTORAGE_PREFERENCES_KEY)
        if (rawDeselects == null)
            return
        
        try {
            const result = JSON.parse(rawDeselects, json_reviver) as IDeadlinePreference
            setDeselectedSubjects(new Map(result.deselectedSubjects))
            setCompletedDeadlinesVisible(result.showCompletedDeadlines)
        } catch (error) {
            console.warn(`Error parsing data in localstorage with key: [${LOCALSTORAGE_PREFERENCES_KEY}], error: ${error}`)
        }
    }, [])

    useEffect(() => {

        function filterDeadlinesToOnlyIncludeSelectedSubjects(subject: SubjectData) {
            return !deselectedSubjects.has(subject.code)
        }

        setDeadlines(
            sortDeadlines(getDeadlines(content.activeProgramSubjects, filterDeadlinesToOnlyIncludeSelectedSubjects))
        )
    }, [content.activeProgramSubjects, deselectedSubjects])

    function savePreferences(visible?: boolean) {
        const saveObject = JSON.stringify({
            deselectedSubjects,
            showCompletedDeadlines: visible ?? completedDeadlinesVisible
        } as IDeadlinePreference, json_replacer)

        localStorage.setItem(LOCALSTORAGE_PREFERENCES_KEY, saveObject)
    }

    function toggleSubjectVisibility(event: React.ChangeEvent<HTMLInputElement>, subjectCode: string) {
        if (event.target.checked) {
            deselectedSubjects.delete(subjectCode)
            setDeselectedSubjects(new Map(deselectedSubjects))
        }
        
        else if (!deselectedSubjects.has(subjectCode)) {
            deselectedSubjects.set(subjectCode, true)
            setDeselectedSubjects(new Map(deselectedSubjects))
        }
        savePreferences()
    }

    function toggleSwitch(event: React.ChangeEvent<HTMLInputElement>) {
        setCompletedDeadlinesVisible(event.target.checked)
        savePreferences(event.target.checked)
    }

    return (
        <div className="deadlines-layout-container">
            <div className={`deadlines-layout-grid-container ${selectionActive ? "deadlines-layout-grid-selection-active" : ""}`}>
                <div className="deadlines-layout-box-container-intro">
                    <h3>Deadlines</h3>
                    <div className="deadlines-selection-list">
                        <p className="deadliens-selection-container-title">Applied filter:</p>
                        <div>
                            {content.activeProgramSubjects
                                .filter(current => !current.archived && !deselectedSubjects.has(current.code))
                                .map(current => (
                                    <div key={current._id} className="tag-element">
                                        <p>{current.code}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="deadlines-select-button" onClick={() => setSelectionActive(!selectionActive)}>
                        <p>{selectionActive ? "Cancel" : "Customize"}</p>
                    </div>
                </div>
                <div className="default-box-container deadlines-deadline-layout-box">
                    <div className="deadlines-container">
                        {deadlines
                            .filter(current => 
                                completedDeadlinesVisible || 
                                (!completedDeadlinesVisible && completedDeadlines.findIndex(completed => completed === current._id) < 0))
                            .map(current => 
                                <ContentObject
                                    key={current._id}
                                    type={ContentType.DEADLINE}
                                    parentId={"0"}
                                    id={current._id}
                                    contentObject={current.deadline!}
                                    noEditMode
                                    accent
                                />
                        )}
                    </div>
                </div>
                {selectionActive &&
                    <div className="default-box-container deadlines-selection-layout-box">
                        <div>
                            <p className="deadline-selection-description">Filter which deadlines you are interested in</p>
                        </div>
                        <div className="course-header-edit-mode-switch-container deadlines-toggle-switch-container">
                            <p>View completed deadlines</p>
                            <label className="course-header-edit-mode-switch switch">
                                <input onChange={toggleSwitch} checked={completedDeadlinesVisible} type="checkbox" />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        {content.activeProgramSubjects.filter(current => !current.archived).map(current => 
                            <div key={current._id} className="deadlines-selection-row">
                                <input id={current.code} type="checkbox" checked={!deselectedSubjects.has(current.code)} onChange={(event) => toggleSubjectVisibility(event, current.code)} />
                                <div className="deadlines-selection-row-label-container">
                                    <label className="deadlines-select-checkbox-label" htmlFor={current.code}>{current.code}</label>
                                    <label className="deadlines-select-checkbox-label" htmlFor={current.code}>{current.name}</label>
                                </div>
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}
