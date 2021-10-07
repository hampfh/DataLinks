import { ContentType } from 'components/utilities/contentTypes'
import React, { useState } from 'react'
import { connect } from "react-redux"
import { IReduxRootState } from 'state/reducers'
import { IAppState } from 'state/reducers/app'
import RenderContent from './RenderContent'

import TemporaryFields from './TemporaryFields'
import { v4 as uuid } from "uuid"
import { onSubmitElement, updateGroup } from "functions/contentRequests"
import { StateForComponent as NewElement } from "components/templates/content_rendering/TemporaryFields"
import "./RenderData.css"
import "./Group.css"
import Dummy from '../content_objects/Dummy'
import { calculateIndexFromRelative, getTarget, insertDummyPositionIntoContent, submitElementReorder } from 'functions/content_reordering'
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
    const [draggableElementSize, setDraggableElementSize] = useState<{ width: number, height: number }>()
    const [initialIndex, setInitialIndex] = useState<number>(0)

    const resetContent = (localContent?: ContentObject[]) => {
        const deepCopy: ContentObject[] = JSON.parse(JSON.stringify(localContent ?? content))
        for (let i = 0; i < deepCopy.length; i++) {
            if (deepCopy[i]._id.toString() === "DUMMY")
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

        // ? Wait one render-cycle before fetching the dimensions of the draggable
        // (This is because we set the state in this function and must wait for it to apply)
        setTimeout(() => {
            if (draggableElementSize == null) {

                const draggableContainer = document.querySelector(`
                    .draggable-wrapper > .ContentObject > .RenderContentContainer > .default-nested-box-container,
                    .draggable-wrapper > .ContentObject > .RenderContentContainer > .dynamic-content-group-container
                `)
                if (draggableContainer) {

                    setDraggableElementSize({
                        width: draggableContainer?.clientWidth,
                        height: draggableContainer?.clientHeight
                    })
                }
            }
        })
    }

    function grapGestureMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!dragging)
            return

        const newContent = resetContent(content)!

        const groupContent = document.querySelectorAll(`
            .group-item-container.dragging > .RenderContentContainer > .default-nested-box-container, 
            .group-item-container.dragging > .RenderContentContainer > .dynamic-content-group-container, 
            .dummy-element
        `)
        const index = getTarget(event, groupContent)
        if (index >= 0) {
            newContent.splice(index, 0, { _id: "DUMMY"})
            setContent(newContent)
        }

        setCursor({
            x: event.clientX,
            y: event.clientY + window.scrollY
        })
    }

    function grapGestureEnd(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (draggableElement) {
            setDragging(false)
            setInitialIndex(0)

            const index = content.findIndex(current => current._id === "DUMMY")
            if (index >= 0) {
                content.splice(index, 1, draggableElement)
                setContent(content)
            }

            // Only submit change if element has actually change position
            if (index !== initialIndex)
                submitElementReorder(props.group._id, draggableElement._id, index, props.app.fingerprint!)
        }

        setDraggableElementSize(undefined)
    }

    function propFilter(value: ContentObject, index: number, array: ContentObject[]) {
        if (props.contentFilter)
            return props.contentFilter(value, index, array)
        return true
    }

    function populateCssClasses() {
        let string = "dynamic-content-group-container"
        if (props.group.column) string += " column"
        if (props.group.depth <= 1) string += " dynamic-content-group-root-container"
        if (props.group.split) string += " header-border"
        if (props.app.flags.editMode) string += " border"
        return string
    }

    return (
        <div
            className={populateCssClasses()}
            style={props.app.flags.editMode ? {
                margin: "1rem",
                borderStyle: "solid",
                borderWidth: "3px",
                borderColor: "#fff"
            } : undefined}
        >
            {props.group.name &&
                <h4 className="group-item-title">{props.group.name}</h4> // Display group name
            }

            { // Control panel for group
                props.app.flags.editMode && 
                    <GroupButtonPanel 
                        group={props.group}
                        newGroup={newGroup}
                        updateGroup={updateGroup}
                        setNewGroup={setNewGroup}
                        setNewElement={setNewElement}
                        fingerprint={props.app.fingerprint!}
                    />
            }

            <div className={`group-item-container ${dragging ? "dragging" : ""} ${props.group.column ? "Column" : ""}`}>
                { // Generate temporary elements
                    newElement && props.group._id.toString() === newElement.parentGroup.toString() && props.app.flags.editMode &&
                    <TemporaryFields 
                        onSubmitElement={async (temporaryElement: NewElement) => {
                            if (await onSubmitElement(temporaryElement, newElement, props.app.fingerprint!) === 0)
                                setNewElement(undefined)
                        }}
                        onCancel={() => setNewElement(undefined)}
                        type={newElement?.type}
                        parentId={props.group._id}
                    />
                }
                { // Generate all elements in group
                    content.filter(propFilter).map((contentElement) => {
                        // Dummy element
                        if (contentElement._id.toString() === "DUMMY")
                            return <Dummy key={uuid()} size={draggableElementSize ?? { width: 200, height: 100 }} />
                        return <RenderContent 
                            // ? Optimization only in edit mode do we always update the content on every update
                            key={props.app.flags.editMode && !dragging ? uuid() : contentElement._id}
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
                dragging && draggableElement && 
                    /* 
                        ? When active this div will cover the whole
                        ? screen to capture all mouse move events
                    */
                    <div className="draggable-wrapper"
                        onMouseUp={grapGestureEnd}
                        onMouseMove={grapGestureMove}
                    > 
                        <div
                            className="ContentObject"
                            style={dragging && cursor ? {
                                position: "absolute",
                                // ? 32 is the height of drag container
                                top: cursor.y - 32,
                                // ? Split the size in the middle and then adjust with a random value (there is probably some offset somewhere)
                                left: cursor.x - (draggableElementSize?.width ?? 0) / 2 - 18,
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
                }
            </div>
        </div>
    )
}

interface PropsForComponent {
    contentFilter?: (value: ContentObject, index: number, array: ContentObject[]) => boolean
    ignoreGroups?: boolean
    group: Group,
    app: IAppState,
    updateSubjects: () => void
}

const reduxSelect = (state: IReduxRootState) => ({
    app: state.app
})

export default connect(reduxSelect)(Group)