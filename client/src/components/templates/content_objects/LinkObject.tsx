import React from 'react'

export default function LinkObject(props: PropsForComponent) {
    return (
        <div className="ContentObjectContentWrapper">
            {props.editMode ?
                <div className="ButtonWrapper ButtonWrapperEditMode">
                    <div className="editModeField">
                        <label htmlFor="fieldOne" className="editLabel">Display text</label>
                        <input
                            className="editModeInputField"
                            disabled={props.id.toString().length === 0}
                            name="fieldOne"
                            value={props.displayText}
                            onChange={(event) => props.updateElement(event, "first")}
                        />
                    </div>
                    <div className="editModeField">
                        <label htmlFor="fieldTwo" className="editLabel">Link</label>
                        <input
                            className="editModeInputField"
                            disabled={props.id.toString().length === 0}
                            name="fieldTwo"
                            value={props.link}
                            onChange={(event) => props.updateElement(event, "second")}
                        />
                    </div>
                </div> :
                <div className="ButtonWrapper">
                    <a href={props.link} className="Button">
                        {props.displayText}
                    </a>
                </div>
            }
        </div>
    )
}

interface PropsForComponent {
    id: string,
    editMode: boolean,
    displayText: string,
    link: string,
    updateElement: (event: React.ChangeEvent<HTMLInputElement>, fieldNum: "first" | "second" | "third") => void
}