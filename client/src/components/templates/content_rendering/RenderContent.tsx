import ContentObject from "components/templates/content_objects/ContentObject"
import { ContentType } from "components/utilities/contentTypes"
import Group from "./Group"

export default function RenderContent(props: PropsForComponent) {

    return (
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
    )
}

interface PropsForComponent {
    content: ContentObject, 
    parentGroup: string, 
    depth?: number,
    updateSubjects: () => void
}