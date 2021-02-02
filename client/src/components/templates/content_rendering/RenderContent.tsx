import ContentObject from "components/templates/content_objects/ContentObject"
import { ContentType } from "components/utilities/contentTypes"
import React, { useState } from "react"
import { connect } from "react-redux"
import { IReduxRootState } from "state/reducers"
import { IAppState } from "state/reducers/app"
import Dragable from "../content_objects/Dragable"
import Group from "./Group"

export const CONTENT_OBJECT_WIDTH = 190 // Each rem is one 16 pixels
export const CONTENT_OBJECT_HEIGHT = 120 // Each rem is one 16 pixels
const MAX_EDIT_ELEMENTS_PER_ROW = 3

function RenderContent(props: PropsForComponent) {

    const [dragging, setDragging] = useState(false)
    const [cursor, setCursor] = useState<IPosition>({ x: 0, y: 0 })
    const [initialCursor, setInitialCursor] = useState<IPosition>({ x: 0, y: 0 })
    const [lastRelativePosition, setLastRelativePosition] = useState<IPosition>({ x: 0, y: 0 })

    const { resetLocalContent, insertDummyPositionIntoContent } = props

    function setInitialCursorObject(position: IPosition) {
        setInitialCursor({ ...position })
        setCursor({ ...position })
        resetLocalContent()
        insertDummyPositionIntoContent(0, props.content)
    }
    
    function grapGestureMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!dragging)
            return

        const relX = Math.round((event.clientX - initialCursor.x) / CONTENT_OBJECT_WIDTH)
        const relY = Math.round((event.clientY - initialCursor.y) / CONTENT_OBJECT_HEIGHT)

        // Only update relative position if new tile is selected
        if (relX !== lastRelativePosition.x || relY !== lastRelativePosition.y) {
            setLastRelativePosition({ x: relX, y: relY })
            props.insertDummyPositionIntoContent(relX + MAX_EDIT_ELEMENTS_PER_ROW * relY, props.content)
        }

        setCursor({
            x: event.clientX,
            y: event.clientY
        })
    }

    function grapGestureEnd(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        props.submitElementReorder(props.content)
        props.resetLocalContent()
        setDragging(false)
    }

    return (
        <div className={`${dragging ? "DraggableWrapper" : ""}`}
            onMouseUp={grapGestureEnd}
            onMouseMove={grapGestureMove}
        > 
            <div
                className="ContentObject"
                style={dragging && cursor ? {
                    position: "absolute",
                    top: cursor.y - 10,
                    left: cursor.x - CONTENT_OBJECT_WIDTH / 2,
                    zIndex: 1
                } : undefined}
            >
                {props.app.flags.editMode ?
                    <Dragable
                        cursor={cursor}
                        setInitialCursor={setInitialCursorObject}
                        dragging={dragging}
                        setDragging={setDragging}
                    /> : null
                }
                {
                    props.content.group ?
                        <Group
                            key={props.content._id}
                            group={props.content.group}
                            updateSubjects={props.updateSubjects}
                        /> :
                    props.content.link || props.content.text || props.content.deadline ?
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
                        /> :
                        null
                }
            </div>
        </div>
    )
}

interface PropsForComponent {
    content: ContentObject, 
    parentGroup: string, 
    depth?: number,
    app: IAppState,
    updateSubjects: () => void,
    resetLocalContent: () => void,
    insertDummyPositionIntoContent: (index: number, realElement: ContentObject) => void,
    submitElementReorder: (realElement: ContentObject) => Promise<void>
}

const reduxSelect = (state: IReduxRootState) => ({
    app: state.app
})

export default connect(reduxSelect)(RenderContent)