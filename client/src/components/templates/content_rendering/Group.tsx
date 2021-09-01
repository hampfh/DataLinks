import { ContentType } from 'components/utilities/contentTypes'
import React, { useState } from 'react'
import { connect } from "react-redux"
import { IReduxRootState } from 'state/reducers'
import { IAppState } from 'state/reducers/app'
import RenderContent, { CONTENT_OBJECT_WIDTH } from './RenderContent'

import TemporaryFields from './TemporaryFields'
import { v4 as uuid } from "uuid"
import { onSubmitElement, updateGroup } from "functions/contentRequests"
import { StateForComponent as NewElement } from "components/templates/content_rendering/TemporaryFields"
import "./RenderData.css"
import "./Group.css"
import Dummy from '../content_objects/Dummy'
import { calculateIndexFromRelative, insertDummyPositionIntoContent, submitElementReorder } from 'functions/content_reordering'
import GroupButtonPanel from './GroupButtonPanel'

const MAX_EDIT_ELEMENTS_PER_ROW = 3

function Group(props: PropsForComponent) {

    const [newElement, setNewElement] = useState<{
        parentGroup: string,
        type: ContentType
    }>()

    const [newGroup, setNewGroup] = useState<{
        parentGroup: string,
        name: string,
        isSubGroup: boolean
    }>()
    
    const [content, setContent] = useState<ContentObject[]>(props.group.content)

    // Dragging state
    const [dragging, setDragging] = useState(false)
    const [cursor, setCursor] = useState<IPosition>({ x: 0, y: 0 })
    const [initialCursor, setInitialCursor] = useState<IPosition>({ x: 0, y: 0 })
    const [lastRelativePosition, setLastRelativePosition] = useState<IPosition>({ x: 0, y: 0 })
    const [draggableElement, setDraggableElement] = useState<ContentObject>()
    const [initialIndex, setInitialIndex] = useState<number>(0)

    const resetContent = (localContent?: ContentObject[]) => {
        const deepCopy: ContentObject[] = JSON.parse(JSON.stringify(localContent ?? content))
        for (let i = 0; i < deepCopy.length; i++) {
            if (deepCopy[i]._id.toString().length <= 0)
                deepCopy.splice(i--, 1)
        }
        if (localContent)
            return deepCopy
        else
            setContent(deepCopy)
    }

    function assignDraggable(draggableElement: ContentObject) {
        setDraggableElement(draggableElement)
        // Delete draggable from content list
        const contentDeepCopy: ContentObject[] = JSON.parse(JSON.stringify(content))
        const index = contentDeepCopy.findIndex((current) => current._id.toString() === draggableElement._id.toString())
        if (index < 0) {
            console.warn("Id doesn't exist, it really should")
            return
        }
        contentDeepCopy.splice(index, 1)

        setInitialIndex(index)

        insertDummyPositionIntoContent(contentDeepCopy, calculateIndexFromRelative(contentDeepCopy, 0, 0, MAX_EDIT_ELEMENTS_PER_ROW, index), setContent)
    }

    function calculateRelativePosition(event: { clientX: number, clientY: number }, initialCursor: IPosition) {
        return {
            relX: Math.round((event.clientX - initialCursor.x) / CONTENT_OBJECT_WIDTH),
            relY: Math.round((event.clientY - initialCursor.y) / CONTENT_OBJECT_WIDTH)
        }
    }

    function grapGestureMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!dragging)
            return

        const deepCopy = resetContent(content)!

        const { relX, relY } = calculateRelativePosition(event, initialCursor)

        // Only update relative position if new tile is selected
        if ((relX !== lastRelativePosition.x || relY !== lastRelativePosition.y) && draggableElement) {
            setLastRelativePosition({ x: relX, y: relY })
            insertDummyPositionIntoContent(deepCopy, calculateIndexFromRelative(deepCopy, relX, relY, MAX_EDIT_ELEMENTS_PER_ROW, initialIndex), setContent)
        }

        setCursor({
            x: event.clientX,
            y: event.clientY
        })
    }

    function grapGestureEnd(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (draggableElement) {
            resetContent()
            setDragging(false)
            setInitialIndex(0)

            // Locally update elments
            // Note that this only has effects for ~0.5seconds until the sockets update everything too
            const deepCopy = resetContent(content)!
            const { relX, relY } = calculateRelativePosition(event, initialCursor)
            const index = calculateIndexFromRelative(deepCopy, relX, relY, MAX_EDIT_ELEMENTS_PER_ROW, initialIndex)

            // Only submit change if element has actually change position
            if (index !== initialIndex)
                submitElementReorder(props.group._id, draggableElement, content, props.app.fingerprint!)
                
            deepCopy.splice(index, 0, draggableElement)
            setContent(deepCopy)
        }
    }

    return (
        <div
            className={`GroupContainer${props.group.column ? " Column" : ""}
					${props.group.depth !== undefined && props.group.depth > 0 ? " Nested" : ""}
                    ${!props.group.split && !!!props.app.flags.editMode ? " NoBorder" : ""}`}
            style={props.app.flags.editMode ? {
                margin: "1rem",
                borderStyle: "solid",
                borderWidth: "3px",
                borderColor: "#fff"
            } : undefined}
        >
            {props.group.name ? 
                <h4 className="textObjectTitle">{props.group.name}</h4> : // Display group name
                null
            }

            <div className={`GroupItemContainer${props.group.column ? " Column" : ""}`}>
                { // Generate all elements in group
                    content.map((contentElement) => {
                        // Dummy element
                        if (contentElement._id.toString().length <= 0)
                            return <Dummy key={uuid()} />
                        return <RenderContent 
                            // ? Optimization possibility here detect if field changes instead of using uuid (and forcibly updating every time)
                            key={uuid()}
                            parentGroup={props.group._id} 
                            content={contentElement} 
                            depth={props.group.depth ? props.group.depth + 1 : 1} 
                            updateSubjects={props.updateSubjects}
                            resetLocalContent={resetContent}

                            setDragging={setDragging}
                            cursor={cursor}
                            setCursor={setCursor}
                            initialCursor={initialCursor}
                            setInitialCursor={setInitialCursor}
                            lastRelativePosition={lastRelativePosition}
                            setLastRelativePosition={setLastRelativePosition}
                            setDraggableElement={assignDraggable}
                        />                        
                    })
                }

                { // Render draggable element
                dragging && draggableElement ? 
                    <div className={`${dragging ? "DraggableWrapper" : ""}`}
                        onMouseUp={grapGestureEnd}
                        onMouseMove={grapGestureMove}
                    > 
                        <div
                            className="ContentObject"
                            style={dragging && cursor ? {
                                position: "absolute",
                                top: cursor.y - 32,
                                left: cursor.x - CONTENT_OBJECT_WIDTH / 2,
                                zIndex: 1
                            } : undefined}
                        >
                            <RenderContent 
                                key={draggableElement._id}
                                parentGroup={props.group._id}
                                content={draggableElement}
                                depth={props.group.depth ? props.group.depth + 1 : 1}
                                updateSubjects={props.updateSubjects}
                                resetLocalContent={resetContent}

                                setDragging={setDragging}
                                cursor={cursor}
                                setCursor={setCursor}
                                initialCursor={initialCursor}
                                setInitialCursor={setInitialCursor}
                                lastRelativePosition={lastRelativePosition}
                                setLastRelativePosition={setLastRelativePosition}
                                setDraggableElement={assignDraggable}
                            />
                        </div>
                    </div>
                : null}

                { // Generate temporary elements
                    newElement && props.group._id.toString() === newElement.parentGroup.toString() && props.app.flags.editMode ?
                    <TemporaryFields 
                        onSubmitElement={async (temporaryElement: NewElement) => {
                            onSubmitElement(temporaryElement, newElement, props.app.fingerprint!) 
                            && setNewElement(undefined)
                        }}
                        type={newElement?.type}
                        parentId={props.group._id}
                    /> : null
                }
            </div>
            { // Control panel for group
                props.app.flags.editMode ? 
                    <GroupButtonPanel 
                        group={props.group}
                        newGroup={newGroup}
                        updateGroup={updateGroup}
                        setNewGroup={setNewGroup}
                        setNewElement={setNewElement}
                        fingerprint={props.app.fingerprint!}
                    /> : null
            }
        </div>
    )
}

interface PropsForComponent {
    group: Group,
    app: IAppState,
    updateSubjects: () => void
}

const reduxSelect = (state: IReduxRootState) => ({
    app: state.app
})

export default connect(reduxSelect)(Group)