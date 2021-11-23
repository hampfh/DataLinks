import { INewElement } from "components/templates/content_rendering/TemporaryFields"
import { ContentType } from "components/utilities/content_type"
import Moment from "moment"
import Http from "functions/HttpRequest"
import { IEditLocalObject } from "state/actions/local"

// Take the virtual new element from the state and submit it to the database
export async function onSubmitElement(newElementObject: INewElement, newElement: {
    parentGroup: string,
    type: ContentType
}): Promise<number> {

    let appendObject: {
        parentGroup: string,
        title?: string,
        text?: string,
        displayText?: string,
        link?: string,
        deadline?: string,
        start?: string,
        placement: number
    } = {
        parentGroup: newElementObject.parentId ?? newElement?.parentGroup,
        placement: 0
    }
    if (newElementObject.type === "TEXT") {
        if (newElementObject.fieldOne.length !== 0)
            appendObject.title = newElementObject.fieldOne

        // Do not allow empty text
        if (newElementObject.fieldTwo.length === 0)
            return 1
        appendObject.text = newElementObject.fieldTwo
    } else if (newElementObject.type === "LINK") {

        // Do not allow empty displayName or link
        if (newElementObject.fieldOne.length === 0 || newElementObject.fieldTwo.length === 0)
            return 1

        appendObject.displayText = newElementObject.fieldOne
        appendObject.link = newElementObject.fieldTwo
    } else if (newElementObject.type === "DEADLINE") {

        // Do not allow empty date or wrong field
        if (newElementObject.fieldTwo.length === 0 || !!!newElementObject.fieldTwoCorrect)
            return 1

        appendObject.displayText = newElementObject.fieldOne
        appendObject.deadline = Moment(newElementObject.fieldTwo).toDate().toString()
        appendObject.start = Moment().toDate().toString()
    }

    let urlSuffix: string = ""
    if (newElementObject.type === "TEXT")
        urlSuffix = "/textcontent"
    else if (newElementObject.type === "LINK")
        urlSuffix = "/linkcontent"
    else if (newElementObject.type === "DEADLINE")
        urlSuffix = "/deadlinecontent"

    const response = await Http({
        url: "/api/v1/group" + urlSuffix,
        method: "POST",
        data: appendObject
    })

    return response.status
}

export async function onSubmitGroup(name: string, newGroup: {
    parentGroup: string,
    name: string,
    isSubGroup: boolean
} | undefined): Promise<number> {

    if (!newGroup || !newGroup?.parentGroup)
        return 0

    let submitObject: {
        name?: string,
        parentGroup: string,
        split: boolean,
        column: boolean
    } = {
        parentGroup: newGroup?.parentGroup,
        split: false,
        column: false
    }

    if (name != null && name.length !== 0)
        submitObject.name = name

    const response = await Http({
        url: "/api/v1/group",
        method: "POST",
        data: submitObject
    })

    return response.status
}

export async function deleteGroup(id: string): Promise<number> {
    if (!!!window.confirm("Are you sure you want to delete this group, all it's children will also be deleted"))
        return 0

    const response = await Http({
        url: "/api/v1/group",
        method: "DELETE",
        data: {
            id
        }
    })

    return response.status
}

export async function updateGroup(id: string, setting: "split" | "column" | "placement", value: boolean | number): Promise<number> {

    let updateObject: {
        id: string,
        split?: boolean,
        column?: boolean,
        placement?: number
    } = {
        id
    }

    if (setting === "split")
        updateObject.split = value as boolean
    else if (setting === "column")
        updateObject.column = value as boolean
    else if (setting === "placement")
        updateObject.placement = value as number

    const response = await Http({
        url: "/api/v1/group",
        method: "PATCH",
        data: updateObject
    })

    return response.status
}

/**
 * Remotely update a content object for either, text, link or deadline
 * @param parentGroup 
 * @param id 
 * @param type 
 * @param fieldOne 
 * @param fieldTwo 
 */
export async function remoteUpdateElement(parentGroup: string, id: string, type: ContentType, fieldOne: string, fieldTwo: string): Promise<number> {
    let append: IEditLocalObject = {
        parentGroup: parentGroup.toString(),
        id,
    }

    let urlPathPrefix = ""
    switch(type) {
        case ContentType.TEXT:
            urlPathPrefix = "textcontent"
            append.title = fieldOne.length <= 0 ? "-" : fieldOne
            append.text = fieldTwo.length <= 0 ? "-" : fieldTwo
            break
        case ContentType.LINK:
            urlPathPrefix = "linkcontent"
            append.displayText = fieldOne.length <= 0 ? "-" : fieldOne
            append.link = fieldTwo.length <= 0 ? "-" : fieldTwo
            break
        case ContentType.DEADLINE:
            urlPathPrefix = "deadlinecontent"
            append.displayText = fieldOne.length <= 0 ? "-" : fieldOne
            append.deadline = fieldTwo.length <= 0 ? "-" : Moment(fieldTwo).toString()
            break
    }

    const response = await Http({
        url: `/api/v1/group/${urlPathPrefix}`,
        method: "PATCH",
        data: append
    })

    return response.status
}

export async function remoteDeleteElement(parentGroup: string, id: string): Promise<number> {
    if (window.confirm("Are you sure you want to delete this item?")) {
        const response = await Http({
            url: "/api/v1/group/content",
            method: "DELETE",
            data: {
                parentGroupId: parentGroup,
                id
            }
        })

        return response.status
    }
    return 0
}