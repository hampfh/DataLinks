import React from 'react'

export default function TextObject(props: PropsForComponent) {
    return (
        <div>
            {props.editMode ? 
                <div className="ButtonWrapper ButtonWrapperEditMode">
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
                <div className="textObjectWrapper">
                    {props.title === undefined ? null :
                        <h5 className="textObjectTitle">{props.title}</h5>
                    }
                    {props.text === undefined ? null :
                        <p className="textObject">{props.text}</p>
                    }
                </div>
            }
        </div>
    )
}

interface PropsForComponent {
    id: string,
    editMode: boolean,
    title: string,
    text: string,
    updateElement: (event: React.ChangeEvent<HTMLInputElement>, fieldNum: "first" | "second" | "third") => void
}