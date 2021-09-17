import React from 'react'
import "./LinkObject.css"

export default function LinkObject(props: PropsForComponent) {
    return (
        <>
            {props.editMode ?
                <div className="link-button-wrapper ButtonWrapperEditMode">
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
                
                <div className="link-button-wrapper">
                    <a className="link-button-link" href={props.link}>
                        <p className="link-button">
                            {props.displayText}
                        </p>
                    </a>
                </div>
            }
        </>
    )
}

interface PropsForComponent {
    id: string,
    editMode: boolean,
    displayText: string,
    link: string,
    updateElement: (event: React.ChangeEvent<HTMLInputElement>, fieldNum: "first" | "second" | "third") => void
}