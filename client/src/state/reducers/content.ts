import { SubjectData } from "components/screens/Subjects/Subjects"
import { ActionType } from "./"
export interface IContentState {
    hasLoaded: boolean
    activeProgramId?: string
    activeProgramName?: string
    activeProgramSubjects: SubjectData[]
}

const defaultState = {
    hasLoaded: false,
    activeProgramSubjects: []
}

const content = (state: IContentState = defaultState, action: ActionType<any>) => {
    const newState = { ...state };
    switch (action.type) {
        case "SET_HAS_LOADED":
            newState.hasLoaded = action.payload.loaded
            return newState
        case "SET_ACTIVE_PROGRAM":
            newState.activeProgramId = action.payload.id
            newState.activeProgramName = action.payload.name
            newState.activeProgramSubjects = action.payload.subjects ?? []
            return newState
        case "SET_ALL_SUBJECTS":
            newState.activeProgramSubjects = action.payload.subjects
            return newState
        default:
            return newState
    }
}

export default content;