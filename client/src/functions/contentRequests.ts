import { StateForComponent as NewElement } from "components/templates/content_rendering/TemporaryFields"
import { ContentType } from "components/utilities/contentTypes"
import Moment from "moment"
import Http from "functions/HttpRequest"
import { IEditLocalObject } from "state/actions/local"

// Take the virtual new element from the state and submit it to the database
export async function onSubmitElement(newElementObject: NewElement, newElement: {
    parentGroup: string,
    type: ContentType
}, fingerprint: string): Promise<number> {

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
        data: {
            ...appendObject,
            fingerprint
        }
    })

    if (response.status === 404) {
        if (window.confirm("You tried to edit a deleted resource, reload the page to renew the content"))
            window.location.reload()
    }
    else if (response.status !== 201 && response.status !== 200) {
        if (window.confirm("The site encountered an error, reload the site?"))
            window.location.reload()
    }

    return 0
}

export async function onSubmitGroup(name: string, newGroup: {
    parentGroup: string,
    name: string,
    isSubGroup: boolean
}, fingerprint: string) {

    if (!newGroup?.parentGroup)
        return

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

    await Http({
        url: "/api/v1/group",
        method: "POST",
        data: {
            ...submitObject,
            fingerprint
        }
    })

    // Force reload the site
    window.location.reload()
}

export async function deleteGroup(id: string, fingerprint: string) {
    if (!!!window.confirm("Are you sure you want to delete this group, all it's children will also be deleted"))
        return

    const response = await Http({
        url: "/api/v1/group",
        method: "DELETE",
        data: {
            id,
            fingerprint
        }
    })

    if (response.status !== 200) {
        if (window.confirm("An error occured, would you like to reload the site?"))
            window.location.reload()
    }
}

export async function updateGroup(id: string, setting: "split" | "column" | "placement", value: boolean | number, fingerprint: string) {

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

    await Http({
        url: "/api/v1/group",
        method: "PATCH",
        data: {
            ...updateObject,
            fingerprint
        }
    })

    // TODO this should seemsly update
    window.location.reload()
}

/**
 * Remotely update a content object for either, text, link or deadline
 * @param parentGroup 
 * @param id 
 * @param type 
 * @param fieldOne 
 * @param fieldTwo 
 * @param fingerprint 
 */
export async function remoteUpdateElement(parentGroup: string, id: string, type: ContentType, fieldOne: string, fieldTwo: string, fingerprint: string) {
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
        data: {
            ...append,
            fingerprint: fingerprint
        }
    })

    if (response.status !== 200) {
        if (window.confirm("The site encountered an error, reload the site?"))
            window.location.reload()
    }
}

export async function remoteDeleteElement(parentGroup: string, id: string, fingerprint: string) {
    if (window.confirm("Are you sure you want to delete this item?")) {
        const response = await Http({
            url: "/api/v1/group/content",
            method: "DELETE",
            data: {
                parentGroupId: parentGroup,
                id,
                fingerprint
            }
        })

        if (response.status !== 200) {
            if (window.confirm("The site encountered an error, reload the site?"))
                window.location.reload()
        }

        // Deletion is made with sockets
        //this.props.deleteLocally(this.props.id)
    }
}