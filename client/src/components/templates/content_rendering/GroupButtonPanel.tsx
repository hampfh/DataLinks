import React from 'react'
import GroupForm from './GroupForm'
import { v4 as uuid } from "uuid"
import { deleteGroup, onSubmitGroup, updateGroup } from 'functions/contentRequests'
import { ContentType } from 'components/utilities/contentTypes'
import "./GroupButtonPanel.css"

export default function GroupButtonPanel(props: PropForComponent) {
    return (
        <div className="GroupButtonContainer">
            <div className="GroupButtonContainerNewContent">
                <button onClick={() => props.setNewElement({ parentGroup: props.group._id, type: ContentType.TEXT })}>Add text</button>
                <button onClick={() => props.setNewElement({ parentGroup: props.group._id, type: ContentType.LINK })}>Add link</button>
                <button onClick={() => props.setNewElement({ parentGroup: props.group._id, type: ContentType.DEADLINE })}>Add deadline</button>
                <GroupForm
                    key={uuid()}
                    forRoot={false}
                    parentId={props.group._id}
                    newGroup={props.newGroup}
                    createGroup={(isSubGroup: boolean) => props.setNewGroup({
                        parentGroup: props.group._id,
                        name: "",
                        isSubGroup: isSubGroup
                    })}
                    submitGroup={(name) => onSubmitGroup(name, props.newGroup)}
                />
            </div>
            <div className="GroupButtonContainerOptions">
                <button onClick={() => 
                    updateGroup(
                        props.group._id, 
                        "split", 
                        !props.group.split)}
                    >{props.group.split ? "Disable" : "Enable"} split</button>
                <button onClick={() => 
                    updateGroup(
                        props.group._id, 
                        "column", 
                        !props.group.column)}
                    >{props.group.column ? "Disable" : "Enable"} column</button>
            </div>
            {props.group.depth > 1 ?
                <div className="GroupButtonContainerDeleteGroup">
                    <button onClick={() => deleteGroup(props.group._id)}>Delete this group</button>
                </div> : null
            }
        </div>
    )
}

interface PropForComponent {
    group: Group,
    newGroup?: {
        parentGroup: string,
        name: string,
        isSubGroup: boolean
    },
    updateGroup: (id: string, setting: "split" | "column" | "placement", value: number | boolean) => void,
    setNewElement: (data: {
        parentGroup: string,
        type: ContentType
    }) => void,
    setNewGroup: (data: {
        parentGroup: string,
        name: string,
        isSubGroup: boolean
    }) => void
}