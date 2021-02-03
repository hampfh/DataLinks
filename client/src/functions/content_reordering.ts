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
    const initialRelativeXPosition = initialIndex % elementsPerRow
    if (initialRelativeXPosition + relX >= elementsPerRow - 1)
        relX = (elementsPerRow - 1) - initialRelativeXPosition
    else if (initialRelativeXPosition + relX < 0)
        relX = initialRelativeXPosition * - 1

    const initialRelativeYPosition = Math.floor(initialIndex / elementsPerRow)
    if (initialRelativeYPosition + relY >= Math.floor(content.length / elementsPerRow))
        relY = Math.floor(content.length / elementsPerRow) - initialRelativeYPosition
    else if (initialRelativeYPosition + relY < 0)
        relY = initialRelativeYPosition * - 1

    return relX + elementsPerRow * relY + initialIndex
}