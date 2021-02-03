import Http from "functions/HttpRequest"

export async function submitElementReorder(parentGroup: string, realElement: ContentObject, content: ContentObject[], fingerprint: string) {

    // Find dummy element and delete it
    let dummyIndex = content.findIndex((current) => current._id.toString().length <= 0)

    await Http({
        url: "/api/v1/group/order",
        method: "PATCH",
        data: {
            parentGroup,
            id: realElement._id,
            position: dummyIndex,
            fingerprint
        }
    })
}

export const insertDummyPositionIntoContent = (
    content: ContentObject[], 
    newIndex: number, 
    setContent: React.Dispatch<React.SetStateAction<ContentObject[]>>,
) => {

    // Deep copy content
    const newContent: ContentObject[] = JSON.parse(JSON.stringify(content))
    if (newIndex >= newContent.length)
        newContent.push({ _id: "" })
    else
        // Insert dummy object
        newContent.splice(newIndex < 0 ? 0 : newIndex, 0, { _id: "" })

    setContent(newContent)
}

export const calculateIndexFromRelative = (content: ContentObject[], relX: number, relY: number, elementsPerRow: number, initialIndex: number) => {
    return relX + elementsPerRow * relY + initialIndex
}