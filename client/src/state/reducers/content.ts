import { SubjectData } from "components/screens/Subjects/Subjects"
import { ActionType } from "./"

export interface IContentState {
    subjects: SubjectData[]
}

const defaultState = {
    subjects: []
}

const content = (state: IContentState = defaultState, action: ActionType<any>) => {
    const newState = { ...state };
    switch (action.type) {
        case "SET_ALL_SUBJECTS":
            newState.subjects = action.payload.subjects
            return newState
        default:
            return newState
    }
}

export default content;