import React from 'react'
import "./TextObject.css"

export default function TextObject(props: PropsForComponent) {
    return (
        <>
            {props.editMode ? 
                <div className="text-object-wrapper ButtonWrapperEditMode">
                    <div className="editModeField">
                        <label htmlFor="fieldOne" className="editLabel">Title</label>
                        <input
                            className="editModeInputField"
                            disabled={props.id.toString().length === 0}
                            name="fieldOne"
                            value={props.title}
                            onChange={(event) => props.updateElement(event, "first")}
                        />
                    </div>
                    <div className="editModeField">
                        <label htmlFor="fieldTwo" className="editLabel">Text</label>
                        <input
                            className="editModeInputField"
                            disabled={props.id.toString().length === 0}
                            name="fieldTwo"
                            value={props.text}
                            onChange={(event) => props.updateElement(event, "second")}
                        />
                    </div>
                </div> :

                <div className="text-object-wrapper default-nested-box-container">
                    {props.title === undefined ? null :
                        <h5 className="text-object-title">{props.title}</h5>
                    }
                    {props.text === undefined ? null :
                        <p className="text-object-text">{props.text}</p>
                    }
                </div>
            }
        </>
    )
}

interface PropsForComponent {
    id: string,
    editMode: boolean,
    title: string,
    text: string,
    updateElement: (event: React.ChangeEvent<HTMLInputElement>, fieldNum: "first" | "second" | "third") => void
}