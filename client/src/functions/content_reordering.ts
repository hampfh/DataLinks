import Http from "functions/HttpRequest"

export async function submitElementReorder(parentGroup: string, realElement: ContentObject, content: ContentObject[], fingerprint: string) {

    // Find dummy element and delete it
    let dummyIndex = content.findIndex((current) => current._id.toString().length <= 0)
    if (dummyIndex >= 0)
        content.splice(dummyIndex, 1)

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
    initialContent: ContentObject[],
    relativeIndex: number, 
    realElement: ContentObject, 
    setContent: React.Dispatch<React.SetStateAction<ContentObject[]>>,
    resetContent: () => void
) => {
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