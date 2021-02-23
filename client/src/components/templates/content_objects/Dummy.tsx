import { CONTENT_OBJECT_HEIGHT, CONTENT_OBJECT_WIDTH } from "../content_rendering/RenderContent";

/**
 * The dummy is the blockelement that is projected between elements
 * while the main element is beeing dragged around
 */

export default function Dummy() {
    return (
        <div className={"ButtonWrapper ButtonWrapperEditMode"} style={{
            width: CONTENT_OBJECT_WIDTH,
            height: CONTENT_OBJECT_HEIGHT
        }} />
    )
}
