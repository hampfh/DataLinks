interface Group {
    _id: string,
    name: string,
    depth: number,
    placement: number,
    content: Array<ContentObject>,
    column?: boolean,
    split?: boolean
}