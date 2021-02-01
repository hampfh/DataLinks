import { CONTENT_OBJECT_HEIGHT, CONTENT_OBJECT_WIDTH } from "../content_rendering/RenderContent";

export default function Dummy() {
    return (
        <div className={"ButtonWrapper ButtonWrapperEditMode"} style={{
            width: CONTENT_OBJECT_WIDTH,
            height: CONTENT_OBJECT_HEIGHT
        }} />
    )
}
