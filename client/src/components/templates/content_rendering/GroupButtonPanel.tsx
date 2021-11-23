import GroupForm from './GroupForm'
import { v4 as uuid } from "uuid"
import { deleteGroup as onDeleteGroup, onSubmitGroup, updateGroup as onUpdateGroup } from 'functions/contentRequests'
import { ContentType } from 'components/utilities/content_type'
import "./GroupButtonPanel.css"
import useStatusCodeEvaluator from 'functions/hooks/useStatusCodeEvaluator'

export default function GroupButtonPanel(props: PropForComponent) {

    const { actOnFailedRequest } = useStatusCodeEvaluator()

    async function submitGroup(name: string) {
        actOnFailedRequest(await onSubmitGroup(name, props.newGroup))
        window.location.reload()
    }

    async function updateGroup(method: "split" | "column" | "placement") {
        actOnFailedRequest(await onUpdateGroup(
            props.group._id, 
            method, 
            !props.group.split)
        )
        
        window.location.reload()
    }

    async function deleteGroup() {
        actOnFailedRequest(await onDeleteGroup(props.group._id))
        window.location.reload()
    }

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
                    submitGroup={async (name) => submitGroup(name)}
                />
            </div>
            <div className="GroupButtonContainerOptions">
                <button onClick={async () => updateGroup("split")}>{props.group.split ? "Disable" : "Enable"} split</button>
                <button onClick={() => updateGroup("column")}>{props.group.column ? "Disable" : "Enable"} column</button>
            </div>
            {props.group.depth > 1 ?
                <div className="GroupButtonContainerDeleteGroup">
                    <button onClick={deleteGroup}>Delete this group</button>
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