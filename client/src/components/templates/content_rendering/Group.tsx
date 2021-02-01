import { ContentType } from 'components/utilities/contentTypes'
import React, { useState } from 'react'
import { connect } from "react-redux"
import { IReduxRootState } from 'state/reducers'
import { IAppState } from 'state/reducers/app'
import RenderContent from './RenderContent'

import TemporaryFields from './TemporaryFields'
import GroupForm from './GroupForm'
import { v4 as uuid } from "uuid"
import { deleteGroup, onSubmitElement, onSubmitGroup, updateGroup } from "functions/contentRequests"
import { StateForComponent as NewElement } from "components/templates/content_rendering/TemporaryFields"
import "./RenderData.css"
import "./Group.css"
import Dummy from '../content_objects/Dummy'
import Http from 'functions/HttpRequest'

function Group(props: PropsForComponent) {

    const [newElement, setNewElement] = useState<{
        parentGroup: string,
        type: ContentType
    } | undefined>(undefined)

    const [newGroup, setNewGroup] = useState<{
        parentGroup: string,
        name: string,
        isSubGroup: boolean
    } | undefined>(undefined)
    
    const [content, setContent] = useState<ContentObject[]>(props.group.content)
    const { content: initialContent } = props.group

    const resetContent = () => {
        setContent(JSON.parse(JSON.stringify(initialContent)))
    }

    const insertDummyPositionIntoContent = (relativeIndex: number, element: string, realElement: ContentObject) => {
        resetContent()
        let start = content.findIndex((current) => current._id.toString() === realElement._id.toString())
        if (start < 0) {
            console.warn("Eeee, this doesn't exist")
            return
        }

        const newDummyIndex = start + relativeIndex

        // Deep copy content
        const newContent: ContentObject[] = JSON.parse(JSON.stringify(initialContent))
        if (newDummyIndex >= newContent.length)
            newContent.push({ _id: "" })
        else
            // Insert dummy object
            newContent.splice(newDummyIndex < 0 ? 0 : newDummyIndex, 0, { _id: "" })

        setContent(newContent)
    }

    async function submitElementReorder(realElement: ContentObject) {

        // Find dummy element and delete it
        let dummyIndex = content.findIndex((current) => current._id.toString().length <= 0)
        if (dummyIndex >= 0)
            content.splice(dummyIndex, 1)
          
        await Http({
            url: "/api/v1/group/order",
            method: "PATCH",
            data: {
                parentGroup: props.group._id,
                id: realElement._id,
                position: dummyIndex,
                fingerprint: props.app.fingerprint
            }
        })
    }

    return (
        <div
            className={`GroupContainer${props.group.column ? " Column" : ""}
					${props.group.depth !== undefined && props.group.depth > 0 ? " Nested" : ""}
                    ${props.group.split !== undefined && props.group.split === false && !!!props.app.flags.editMode ? " NoBorder" : ""}`}
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
                    content.map((contentElement, index) => {
                        // Dummy element
                        if (contentElement._id.toString().length <= 0)
                            return <Dummy key={uuid()} />
                        return <RenderContent 
                            key={contentElement._id}
                            parentGroup={props.group._id} 
                            content={contentElement} 
                            depth={props.group.depth ? props.group.depth + 1 : 1} 
                            updateSubjects={props.updateSubjects}
                            resetLocalContent={resetContent}
                            insertDummyPositionIntoContent={insertDummyPositionIntoContent}
                            submitElementReorder={submitElementReorder}
                        />                        
                    })
                }

                { // Generate temporary elements
                    newElement && props.group._id.toString() === newElement.parentGroup.toString() ?
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
                    <>
                        <button onClick={() => setNewElement({ parentGroup: props.group._id, type: ContentType.TEXT })}>Add text</button>
                        <button onClick={() => setNewElement({ parentGroup: props.group._id, type: ContentType.LINK })}>Add link</button>
                        <button onClick={() => setNewElement({ parentGroup: props.group._id, type: ContentType.DEADLINE })}>Add deadline</button>
                        <GroupForm
                            key={uuid()}
                            forRoot={false}
                            parentId={props.group._id}
                            newGroup={newGroup}
                            createGroup={(isSubGroup: boolean) => setNewGroup({
                                parentGroup: props.group._id,
                                name: "",
                                isSubGroup: isSubGroup
                            })}
                            submitGroup={(name) => onSubmitGroup(name, newGroup!, props.app.fingerprint!)}
                        />
                        {props.group.depth > 1 ?
                            <button onClick={() => deleteGroup(props.group._id, props.app.fingerprint!)}>Delete this group</button>
                            : null
                        }
                        <div>
                            <button onClick={() => 
                                updateGroup(
                                    props.group._id, 
                                    "split", 
                                    !props.group.split,
                                    props.app.fingerprint!)}
                                >{props.group.split ? "Disable" : "Enable"} split</button>
                            <button onClick={() => 
                                updateGroup(
                                    props.group._id, 
                                    "column", 
                                    !props.group.column, 
                                    props.app.fingerprint!)}
                                >{props.group.column ? "Disable" : "Enable"} column</button>
                        </div>
                    </> : null
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