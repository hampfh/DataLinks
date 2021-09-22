import Http from "functions/HttpRequest"

export async function submitElementReorder(parentGroup: string, elementId: string, index: number, fingerprint: string) {

    await Http({
        url: "/api/v1/group/order",
        method: "PATCH",
        data: {
            parentGroup,
            id: elementId,
            position: index,
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
        newContent.push({ _id: "DUMMY" })
    else
        // Insert dummy object
        newContent.splice(newIndex < 0 ? 0 : newIndex, 0, { _id: "DUMMY" })

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

export function isWithinBoundaries(
    position: { x: number, y: number}, 
    target: {
        x: number, y: number, width: number, height: number
    }
) {
    return position.x >= target.x && position.x < target.x + target.width &&
        position.y > target.y && position.y < target.y + target.height
}

export function getTarget(cursor: React.MouseEvent<HTMLDivElement, MouseEvent>, elements: NodeListOf<Element>): number {

    for (let i = 0; i < elements.length; i++) {
        if (isWithinBoundaries({
            x: cursor.clientX,
            y: cursor.clientY
        }, {
            x: elements[i].getBoundingClientRect().left,
            y: elements[i].getBoundingClientRect().top,
            width: elements[i].clientWidth,
            height: elements[i].clientHeight
        })) {
            return i
        }
    }

    return -1
}