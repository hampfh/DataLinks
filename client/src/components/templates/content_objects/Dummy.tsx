/**
 * The dummy is the blockelement that is projected between elements
 * while the main element is beeing dragged around
 */

export default function Dummy(props: PropsForComponent) {
    return (
        <div className={"ButtonWrapper ButtonWrapperEditMode dummy-element"} style={{
            width: props.size.width,
            height: props.size.height
        }} />
    )
}

interface PropsForComponent {
    size: {
        width: number
        height: number
    }
}
