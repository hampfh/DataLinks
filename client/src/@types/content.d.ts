interface ILink {
    _id: string,
    displayText: string,
    link: string
}

interface IText {
    _id: string,
    title: string,
    text: string
}

interface IDeadline {
    _id: string,
    displayText: string,
    deadline: string,
    start: string
}

interface ContentObject {
    _id: string,
    link?: ILink,
    text?: IText,
    deadline?: IDeadline,
    group?: Group
}