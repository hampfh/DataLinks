import "./Dragable.css"

export default function Dragable(props: PropsForComponent) {

    function grapGestureStart(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        props.setDragging(true)
        props.setInitialCursor({
            x: event.clientX,
            y: event.clientY
        })
    }

    return (
        <div className={`DragableContainer`}
            onMouseDown={grapGestureStart}
        >
            <div className="DragableLine" />
            <div className="DragableLine" />
            <div className="DragableLine" />
        </div>
    )
}

interface PropsForComponent {
    cursor: IPosition,
    setInitialCursor: (cursor: IPosition) => void,
    setDragging: (state: boolean) => void
}