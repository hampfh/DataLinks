import ContentObject from "components/templates/content_objects/ContentObject"
import { ContentType } from "components/utilities/contentTypes"
import React from "react"
import { connect } from "react-redux"
import { IReduxRootState } from "state/reducers"
import { IAppState } from "state/reducers/app"
import Draggable from "../content_objects/Draggable"
import Group from "./Group"

export const CONTENT_OBJECT_WIDTH = 190 // Each rem is one 16 pixels
export const CONTENT_OBJECT_HEIGHT = 120 // Each rem is one 16 pixels

function RenderContent(props: PropsForComponent) {

    function setInitialCursorObject(position: IPosition) {
        props.setInitialCursor({ ...position })
        props.setCursor({ ...position })
        props.setDraggableElement(props.content)
    }

    return (
        <div className={`RenderContentContainer ${props.content.group ? "Group" : ""} ${props.app.flags.editMode ? "editmode" : ""}`}>
            {props.app.flags.editMode &&
                <Draggable
                    cursor={props.cursor}
                    setInitialCursor={setInitialCursorObject}
                    setDragging={props.setDragging}
                />
            }
            {
                props.content.group ?
                    <Group
                        key={props.content._id}
                        group={props.content.group}
                        updateSubjects={props.updateSubjects}
                        contentFilter={props.contentFilter}
                    /> : 
                    (props.content.link || props.content.text || props.content.deadline) &&
                        <ContentObject
                            key={props.content._id}
                            type={
                                props.content.link ?
                                    ContentType.LINK :
                                    props.content.text ?
                                        ContentType.TEXT :
                                        ContentType.DEADLINE
                            }
                            parentId={props.parentGroup}
                            id={props.content._id}
                            contentObject={
                                props.content.link ?
                                    props.content.link :
                                    props.content.text ?
                                        props.content.text :
                                        props.content.deadline!
                            }
                            updateSubjects={props.updateSubjects}
                        />
            }
        </div>
    )
}

interface PropsForComponent {
    contentFilter?: (value: ContentObject, index: number, array: ContentObject[]) => boolean

    content: ContentObject,
    parentGroup: string,
    depth?: number,
    app: IAppState,
    updateSubjects: () => void,
    resetLocalContent: () => void,
    // Dragging state
    setDragging: (dragging: boolean) => void
    lastRelativePosition: IPosition,
    setLastRelativePosition: (position: IPosition) => void,
    cursor: IPosition,
    setCursor: (position: IPosition) => void,
    initialCursor: IPosition,
    setInitialCursor: (position: IPosition) => void,
    setDraggableElement: (element: ContentObject) => void
}

const reduxSelect = (state: IReduxRootState) => ({
    app: state.app
})

export default connect(reduxSelect)(RenderContent)